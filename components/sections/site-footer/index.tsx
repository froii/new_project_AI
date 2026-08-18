import { owner } from "@/content";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.bar}`}>
        <small>© {owner.name}</small>
      </div>
    </footer>
  );
}
