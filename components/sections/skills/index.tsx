import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import { TagList } from "@/components/ui/tag-list";
import { skills } from "@/content";

export function Skills() {
  const t = useTranslations("skills");

  const items = skills.map((group) => ({
    id: group.id,
    title: t(`groups.${group.id}`),
    meta: group.items.slice(0, 3).join(" · "),
    content: <TagList items={group.items} label={t(`groups.${group.id}`)} />,
  }));

  return (
    <section className="section" id="skills">
      <div className="shell stack">
        <h2>{t("heading")}</h2>
        <p className="muted">{t("intro")}</p>
        <Accordion items={items} defaultOpen={[skills[0]?.id ?? ""]} />
      </div>
    </section>
  );
}
