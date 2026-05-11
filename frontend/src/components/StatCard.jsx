export default function StatCard({ label, value, tone = 'default', icon: Icon, meta }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-card-top">
        {Icon && <span className="stat-icon"><Icon size={17} /></span>}
        <span className="stat-label">{label}</span>
      </div>
      <strong>{value}</strong>
      {meta && <small>{meta}</small>}
    </div>
  );
}
