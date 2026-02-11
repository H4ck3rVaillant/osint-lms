/**
 * Script pour créer le premier utilisateur admin
 * Usage: node setup-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

// Connexion à la DB
const dbPath = path.join(__dirname, 'db/users.db');
const db = new sqlite3.Database(dbPath);

// Interface pour lire les inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAdmin() {
  console.log('\n🔐 === CRÉATION DU COMPTE ADMIN === 🔐\n');

  try {
    // Demander le username
    const username = await question('Username admin: ');
    
    if (!username) {
      console.log('❌ Username requis');
      process.exit(1);
    }

    // Demander le mot de passe
    const password = await question('Mot de passe (min 8 caractères): ');
    
    if (!password || password.length < 8) {
      console.log('❌ Le mot de passe doit faire au moins 8 caractères');
      process.exit(1);
    }

    // Hash du mot de passe
    console.log('\n⏳ Hash du mot de passe...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Générer le secret TOTP
    console.log('⏳ Génération du secret 2FA...');
    const totpSecret = speakeasy.generateSecret({
      name: `CyberOSINT Academy (${username})`,
      issuer: 'CyberOSINT Academy'
    });

    // Créer l'utilisateur dans la DB
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, password, role, totp_secret, must_change_password)
         VALUES (?, ?, ?, ?, ?)`,
        [username, passwordHash, 'admin', totpSecret.base32, 0],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Générer le QR Code
    const qrCodeDataURL = await QRCode.toDataURL(totpSecret.otpauth_url);
    
    // Afficher les résultats
    console.log('\n✅ === ADMIN CRÉÉ AVEC SUCCÈS === ✅\n');
    console.log(`Username: ${username}`);
    console.log(`Mot de passe: ${password}`);
    console.log(`\n🔑 Secret TOTP (base32): ${totpSecret.base32}`);
    console.log('\n📱 QR Code pour FreeOTP/Google Authenticator:');
    console.log(qrCodeDataURL);
    console.log('\n📝 INSTRUCTIONS:');
    console.log('1. Ouvre FreeOTP ou Google Authenticator sur ton téléphone');
    console.log('2. Scan le QR code ci-dessus (copie l\'URL data: dans ton navigateur)');
    console.log('3. Ou entre manuellement le secret TOTP ci-dessus');
    console.log('4. L\'application générera un code à 6 chiffres qui change toutes les 30 secondes');
    console.log('\n⚠️  IMPORTANT: Sauvegarde le secret TOTP dans un endroit sûr !');
    console.log('Si tu perds ton téléphone, tu ne pourras plus te connecter.\n');

    // Sauvegarder dans un fichier
    const fs = require('fs');
    const setupInfo = {
      username,
      password,
      totpSecret: totpSecret.base32,
      qrCode: qrCodeDataURL,
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync('admin-setup.json', JSON.stringify(setupInfo, null, 2));
    console.log('💾 Informations sauvegardées dans admin-setup.json\n');

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      console.log('❌ Cet utilisateur existe déjà');
    } else {
      console.error('❌ Erreur:', error);
    }
  } finally {
    db.close();
    rl.close();
  }
}

setupAdmin();
