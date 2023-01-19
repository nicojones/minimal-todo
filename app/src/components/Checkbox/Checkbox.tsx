
import "./_checkbox.scss";

interface ChecxboxProps {
  checked: boolean;
  onChange: (nextState: boolean) => any;
}

export const Checkbox = ({ checked, onChange }: ChecxboxProps) => {
  return (
    <>
      <input
        type="checkbox"
        className="custom-cb"
        checked={checked}
        onChange={() => onChange(!checked)}
      />
      <div />
    </>
  );
};
