
import { useHistory } from "react-router-dom";
import styles from "./Settings.module.scss";
import { urls } from "config";

export const Settings = () => {

  const history = useHistory();

  return (
    <div className={styles.container}>
      <button className={styles.close} onClick={() => history.push(urls.app)}>
        <i className="material-icons">close</i>
      </button>
      <div className={styles.content}>
        <h3>Coming soon</h3>
      </div>
    </div>
  )
}