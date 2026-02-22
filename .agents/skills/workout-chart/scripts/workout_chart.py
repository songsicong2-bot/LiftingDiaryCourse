# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "psycopg2-binary",
#   "matplotlib",
#   "python-dotenv",
#   "python-dateutil",
# ]
# ///

import os
import sys
from datetime import date
from dateutil.relativedelta import relativedelta
import psycopg2
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from dotenv import load_dotenv

# Load .env from project root (three levels up from .agents/skills/workout-chart/scripts/)
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '.env')
load_dotenv(env_path)

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print('ERROR: DATABASE_URL not found in .env', file=sys.stderr)
    sys.exit(1)

# Connect and query
conn = psycopg2.connect(DATABASE_URL)
try:
    cur = conn.cursor()
    cur.execute("""
        SELECT DATE_TRUNC('month', date)::date AS month, COUNT(*) AS workout_count
        FROM workouts
        WHERE date >= NOW() - INTERVAL '1 year'
        GROUP BY month
        ORDER BY month
    """)
    rows = cur.fetchall()
finally:
    conn.close()

# Build full 12-month range ending at current month
today = date.today()
current_month = today.replace(day=1)
months = [current_month - relativedelta(months=i) for i in range(11, -1, -1)]

# Map DB results into a dict keyed by month start date
db_data = {row[0]: int(row[1]) for row in rows}

counts = [db_data.get(m, 0) for m in months]
labels = [m.strftime('%b %Y') for m in months]

# Plot
style = 'seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'ggplot'
plt.style.use(style)

fig, ax = plt.subplots(figsize=(14, 6))
bars = ax.bar(labels, counts, color='#4F86C6', edgecolor='white', linewidth=0.6, width=0.6)

# Value labels on top of each bar
max_count = max(counts) if max(counts) > 0 else 1
for bar, count in zip(bars, counts):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + max_count * 0.02,
        str(count),
        ha='center', va='bottom',
        fontsize=11, fontweight='bold', color='#333333'
    )

ax.set_title('Workouts per Month (Past 12 Months)', fontsize=16, fontweight='bold', pad=16)
ax.set_xlabel('Month', fontsize=12, labelpad=8)
ax.set_ylabel('Number of Workouts', fontsize=12, labelpad=8)
ax.yaxis.set_major_locator(mticker.MaxNLocator(integer=True))
ax.set_ylim(0, max_count + max_count * 0.25)
plt.xticks(rotation=30, ha='right', fontsize=10)
plt.tight_layout()

# Save alongside the script in .agents/skills/workout-chart/scripts/
out_path = os.path.join(os.path.dirname(__file__), 'workout_chart.png')
out_path = os.path.abspath(out_path)
fig.savefig(out_path, dpi=150, bbox_inches='tight')
plt.close(fig)

print(f'Chart saved to: {out_path}')
print(f'Monthly data:')
for label, count in zip(labels, counts):
    print(f'  {label}: {count}')
