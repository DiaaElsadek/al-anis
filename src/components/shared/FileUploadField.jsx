import { Upload, X, FileText } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * FileUploadField — file input with drag & drop support
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.label]
 * @param {string} [props.accept] — accepted file types
 * @param {File|null} props.value
 * @param {Function} props.onChange
 * @param {string} [props.error]
 * @param {boolean} [props.required]
 */
export default function FileUploadField({
  name,
  label,
  accept,
  value,
  onChange,
  error,
  required,
  className,
}) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ms-1">*</span>}
        </Label>
      )}

      {value ? (
        <Card className="flex items-center gap-2 p-3 bg-muted/50 shadow-none border">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm truncate flex-1">{value.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </Card>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "hover:border-primary/50 hover:bg-primary/5",
            error && "border-destructive"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
          {accept && <p className="text-xs text-muted-foreground/70 mt-1">Accepted: {accept}</p>}
        </div>
      )}

      <input
        ref={inputRef}
        id={name}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onChange(file);
        }}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
