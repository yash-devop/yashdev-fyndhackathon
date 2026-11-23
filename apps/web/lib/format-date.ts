const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value));
}
