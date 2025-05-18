export default function Input({ label, type, value, onChange, name }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          style={{ display: 'block', width: '100%', padding: '0.5rem' }}
        />
      </label>
    </div>
  );
}
