interface CSVExportConfig<T> {
  /** The header row for the CSV file */
  headers: string[];
  /** Function to transform each data item into CSV row values */
  rowTransformer: (item: T) => string[];
  /** The data to be exported */
  data: T[];
  /** The name of the output file (without .csv extension) */
  filename: string;
}

/**
 * Generic utility to export data as CSV
 * @param config Configuration for CSV export
 * @example
 * ```typescript
 * exportToCSV({
 *   headers: ["Date", "Value (USD)"],
 *   rowTransformer: (item) => [
 *     new Date(item.timestamp * 1000).toISOString(),
 *     item.value_usd.toString()
 *   ],
 *   data: chartData.result,
 *   filename: "chart_data"
 * });
 * ```
 */
export function exportToCSV<T>({
  headers,
  rowTransformer,
  data,
  filename,
}: CSVExportConfig<T>) {
  if (!data || data.length === 0) return;

  const csvRows = [
    headers.join(","),
    ...data.map((item) => rowTransformer(item).join(",")),
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `${filename}.csv`);
  link.click();
}
