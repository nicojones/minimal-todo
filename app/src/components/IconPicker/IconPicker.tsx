import { IProject, PDefault } from "interfaces";
import "./icon-picker.scss";
import { projectIcons } from "config";

interface IconPickerProps {
  icon: IProject["icon"];
  onIconChange: (icon: IProject["icon"]) => any;
}

export const IconPicker = ({ icon, onIconChange }: IconPickerProps) => {

  const setIcon = (e: PDefault, icon: IProject["icon"]): void => {
    console.log(icon + " selected");
    e.preventDefault();
    onIconChange(icon);
  };

  return (
    <div>
      <ul className="inline">
        {projectIcons.map((iconItem: string) => (
          <li key={iconItem}>
            <button
              title={iconItem}
              className="btn invisible p-0"
              onClick={(e) => setIcon(e, iconItem)}
            >
              <i className={'material-icons ' + (iconItem == icon ? 'selected' : '')}>{iconItem}</i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
