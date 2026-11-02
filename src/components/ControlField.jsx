import "./ControlField.css"

export default function ControlField({
  label,
  name,
  value,
  min,
  max,
  step,
  suffix = "",
  type = "number",
  onChange,
}) {
  return (
    <label className="control-field">
      <span className="control-field__label">
        {label}
        {type === "range" ? (
          <output className="control-field__value">
            {value}
            {suffix}
          </output>
        ) : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </label>
  )
}
