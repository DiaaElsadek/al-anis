import { MapPin, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { GOVERNORATES } from "@/lib/constants";
import { cn, getLocalizedCategoryName } from "@/lib/utils";

export default function DirectoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedGovernorate,
  onSelectGovernorate,
  onlyAvailable,
  onToggleAvailable,
  providersCount,
  totalCount,
  language,
}) {
  const { t } = useTranslation(["client", "common"]);

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 shadow-sm space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full text-xs font-semibold h-8"
          onClick={() => onSelectCategory("all")}
        >
          {t("client:directory.allCategories")}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs font-medium h-8 whitespace-nowrap"
            onClick={() => onSelectCategory(cat.id)}
          >
            <CategoryIcon
              icon={cat.icon}
              name={cat.name}
              className="h-3.5 w-3.5 me-1.5 inline-block"
            />
            {getLocalizedCategoryName(cat, language)}
          </Button>
        ))}
      </div>

      {/* Secondary Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-3">
          {/* Governorate Select */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <Select value={selectedGovernorate} onValueChange={onSelectGovernorate}>
              <SelectTrigger className="h-8 text-xs font-medium w-[160px]">
                <SelectValue placeholder={t("client:directory.allGovernorates")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  {t("client:directory.allGovernorates")}
                </SelectItem>
                {GOVERNORATES.map((gov) => (
                  <SelectItem key={gov} value={gov} className="text-xs">
                    {gov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability Toggle */}
          <Toggle
            pressed={onlyAvailable}
            onPressedChange={onToggleAvailable}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-emerald-500/10 data-[state=on]:border-emerald-500/30 data-[state=on]:text-emerald-700 data-[state=on]:font-semibold"
          >
            <CheckCircle2
              className={cn(
                "h-3.5 w-3.5",
                onlyAvailable ? "text-emerald-600" : "text-muted-foreground"
              )}
            />
            {t("client:directory.availableOnly")}
          </Toggle>
        </div>

        <div className="text-xs text-muted-foreground">
          {t("common:pagination.showing", {
            from: providersCount > 0 ? 1 : 0,
            to: providersCount,
            total: totalCount,
          })}
        </div>
      </div>
    </div>
  );
}

DirectoryFilters.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedGovernorate: PropTypes.string.isRequired,
  onSelectGovernorate: PropTypes.func.isRequired,
  onlyAvailable: PropTypes.bool.isRequired,
  onToggleAvailable: PropTypes.func.isRequired,
  providersCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
};
