from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess, socket, json, re
from typing import Optional
import dns.resolver
import whois
import requests

app = FastAPI(title="Argus V2.0 API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cyberosint-academy.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Argus V2.0 API en ligne", "modules": 50}

@app.get("/api/dns/{domain}")
def dns_lookup(domain: str):
    results = []
    for rtype in ["A", "AAAA", "MX", "NS", "TXT", "CNAME"]:
        try:
            answers = dns.resolver.resolve(domain, rtype)
            for r in answers:
                results.append({"type": rtype, "value": str(r)})
        except:
            pass
    return {"domain": domain, "records": results}

@app.get("/api/whois/{domain}")
def whois_lookup(domain: str):
    try:
        w = whois.whois(domain)
        return {
            "domain": domain,
            "registrar": str(w.registrar or "N/A"),
            "creation_date": str(w.creation_date or "N/A"),
            "expiration_date": str(w.expiration_date or "N/A"),
            "name_servers": [str(ns) for ns in (w.name_servers or [])],
            "status": str(w.status or "N/A"),
            "org": str(w.org or "N/A"),
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/ip/{address}")
def ip_geo(address: str):
    try:
        r = requests.get(f"http://ip-api.com/json/{address}", timeout=5)
        return r.json()
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/ports/{target}")
def port_scan(target: str):
    common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 6379, 8080, 8443]
    open_ports = []
    try:
        ip = socket.gethostbyname(target)
        for port in common_ports:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.5)
                result = s.connect_ex((ip, port))
                if result == 0:
                    try:
                        service = socket.getservbyport(port)
                    except:
                        service = "unknown"
                    open_ports.append({"port": port, "service": service, "state": "open"})
                s.close()
            except:
                pass
        return {"target": target, "ip": ip, "open_ports": open_ports}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/subdomain/{domain}")
def subdomain_finder(domain: str):
    common = ["www", "mail", "ftp", "api", "dev", "staging", "admin", "blog", 
              "shop", "app", "cdn", "static", "media", "vpn", "remote", "test"]
    found = []
    for sub in common:
        try:
            full = f"{sub}.{domain}"
            socket.gethostbyname(full)
            found.append(full)
        except:
            pass
    return {"domain": domain, "subdomains": found, "count": len(found)}

@app.get("/api/ssl/{domain}")
def ssl_check(domain: str):
    import ssl
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(5)
            s.connect((domain, 443))
            cert = s.getpeercert()
            return {
                "domain": domain,
                "valid": True,
                "issuer": dict(x[0] for x in cert.get("issuer", [])),
                "subject": dict(x[0] for x in cert.get("subject", [])),
                "not_before": cert.get("notBefore"),
                "not_after": cert.get("notAfter"),
                "san": cert.get("subjectAltName", []),
            }
    except Exception as e:
        return {"domain": domain, "valid": False, "error": str(e)}

@app.get("/api/headers/{domain}")
def http_headers(domain: str):
    try:
        r = requests.get(f"https://{domain}", timeout=5, allow_redirects=True)
        return {
            "domain": domain,
            "status_code": r.status_code,
            "headers": dict(r.headers),
            "final_url": r.url,
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/tech/{domain}")
def tech_detect(domain: str):
    try:
        r = requests.get(f"https://{domain}", timeout=5)
        headers = r.headers
        body = r.text[:5000]
        techs = []
        
        server = headers.get("Server", "")
        if server: techs.append({"name": "Server", "value": server})
        
        powered = headers.get("X-Powered-By", "")
        if powered: techs.append({"name": "X-Powered-By", "value": powered})
        
        if "react" in body.lower(): techs.append({"name": "React", "value": "detected"})
        if "vue" in body.lower(): techs.append({"name": "Vue.js", "value": "detected"})
        if "angular" in body.lower(): techs.append({"name": "Angular", "value": "detected"})
        if "wordpress" in body.lower(): techs.append({"name": "WordPress", "value": "detected"})
        if "cloudflare" in str(headers).lower(): techs.append({"name": "Cloudflare", "value": "detected"})
        if "nginx" in server.lower(): techs.append({"name": "Nginx", "value": server})
        if "apache" in server.lower(): techs.append({"name": "Apache", "value": server})
        
        return {"domain": domain, "technologies": techs}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/wayback/{domain}")
def wayback(domain: str):
    try:
        r = requests.get(
            f"http://archive.org/wayback/available?url={domain}",
            timeout=5
        )
        data = r.json()
        snapshot = data.get("archived_snapshots", {}).get("closest", {})
        
        r2 = requests.get(
            f"http://web.archive.org/cdx/search/cdx?url={domain}&output=json&limit=5&fl=timestamp,original&filter=statuscode:200",
            timeout=5
        )
        snapshots = r2.json()[1:] if r2.json() else []
        
        return {
            "domain": domain,
            "latest_snapshot": snapshot,
            "recent_snapshots": [{"timestamp": s[0], "url": s[1]} for s in snapshots]
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/scan/{target}")
def full_scan(target: str):
    return {
        "target": target,
        "modules": ["dns", "whois", "ports", "subdomain", "ssl", "headers", "tech"],
        "message": f"Lance chaque module individuellement sur {target}",
        "endpoints": {
            "dns": f"/api/dns/{target}",
            "whois": f"/api/whois/{target}",
            "ports": f"/api/ports/{target}",
            "subdomains": f"/api/subdomain/{target}",
            "ssl": f"/api/ssl/{target}",
            "headers": f"/api/headers/{target}",
            "tech": f"/api/tech/{target}",
        }
    }
