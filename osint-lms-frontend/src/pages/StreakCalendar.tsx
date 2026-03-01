import { useEffect, useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function StreakCalendar() {
  const colors = useThemeColors();
  const [streak, setStreak] = useState(0);
  const [activityData, setActivityData] = useState<Record<string, number>>({});
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storedActivity = localStorage.getItem("activity_calendar") || "{}";
    const activity = JSON.parse(storedActivity);

    // Marquer aujourd'hui comme actif
    if (!activity[today]) {
      activity[today] = 1;
      localStorage.setItem("activity_calendar", JSON.stringify(activity));
    }

    // Calculer le streak
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (activity[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
    setActivityData(activity);
    setTotalDays(Object.keys(activity).length);
  }, []);

  const getCalendarData = () => {
    const weeks: Array<Array<{ date: string; active: boolean }>> = [];
    const today = new Date();
    
    // 52 semaines = 1 an
    for (let week = 0; week < 52; week++) {
      const weekData: Array<{ date: string; active: boolean }> = [];
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - ((51 - week) * 7 + (6 - day)));
        const dateStr = date.toISOString().split("T")[0];
        
        weekData.push({
          date: dateStr,
          active: !!activityData[dateStr],
        });
      }
      
      weeks.push(weekData);
    }
    
    return weeks;
  };

  const calendarData = getCalendarData();

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔥</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Streak & Calendrier
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Suivez votre activité quotidienne style GitHub
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          <div style={{
            background: colors.bgSecondary,
            border: `2px solid ${colors.accent}`,
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔥</div>
            <div style={{ fontSize: "3rem", fontWeight: "bold", color: colors.accent, marginBottom: "5px" }}>
              {streak}
            </div>
            <div style={{ color: colors.textSecondary, fontSize: "1rem" }}>
              Jours de suite
            </div>
          </div>

          <div style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📅</div>
            <div style={{ fontSize: "3rem", fontWeight: "bold", color: colors.textPrimary, marginBottom: "5px" }}>
              {totalDays}
            </div>
            <div style={{ color: colors.textSecondary, fontSize: "1rem" }}>
              Jours actifs
            </div>
          </div>

          <div style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⭐</div>
            <div style={{ fontSize: "3rem", fontWeight: "bold", color: colors.textPrimary, marginBottom: "5px" }}>
              {Math.round((totalDays / 365) * 100)}%
            </div>
            <div style={{ color: colors.textSecondary, fontSize: "1rem" }}>
              Activité annuelle
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px",
        }}>
          <h2 style={{ color: colors.textPrimary, fontSize: "1.5rem", marginBottom: "20px" }}>
            📊 Calendrier d'activité
          </h2>

          <div style={{
            display: "flex",
            gap: "3px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}>
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    title={day.date}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: day.active ? colors.accent : colors.border,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            fontSize: "0.85rem",
            color: colors.textSecondary,
          }}>
            <span>Moins</span>
            <div style={{ width: "12px", height: "12px", background: colors.border, borderRadius: "2px" }} />
            <div style={{ width: "12px", height: "12px", background: colors.accent + "40", borderRadius: "2px" }} />
            <div style={{ width: "12px", height: "12px", background: colors.accent + "80", borderRadius: "2px" }} />
            <div style={{ width: "12px", height: "12px", background: colors.accent, borderRadius: "2px" }} />
            <span>Plus</span>
          </div>
        </div>

        {/* Message motivation */}
        {streak >= 7 && (
          <div style={{
            marginTop: "30px",
            padding: "20px",
            background: `${colors.accent}20`,
            border: `1px solid ${colors.accent}`,
            borderRadius: "8px",
            textAlign: "center",
          }}>
            <p style={{ color: colors.accent, fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>
              🎉 Bravo ! Vous avez un streak de {streak} jours ! Continuez comme ça !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
