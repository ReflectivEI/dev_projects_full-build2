/**
 * Export Utilities
 * 
 * Handles PDF and CSV export functionality for reports and data.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV content
  const csvRows = [];
  csvRows.push(csvHeaders.join(','));

  for (const row of data) {
    const values = csvHeaders.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export progress report to PDF
 */
export function exportProgressReportPDF(
  userData: {
    name: string;
    email: string;
    specialty: string;
  },
  metrics: Array<{
    name: string;
    score: number;
    change: number;
  }>,
  sessions: Array<{
    date: string;
    type: string;
    duration: string;
    score: number;
  }>,
  filename: string = 'progress-report'
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Progress Report', 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  // User Info
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('User Information', 14, 42);
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Name: ${userData.name}`, 14, 50);
  doc.text(`Email: ${userData.email}`, 14, 56);
  doc.text(`Specialty: ${userData.specialty}`, 14, 62);

  // Metrics Table
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Behavioral Metrics', 14, 74);

  autoTable(doc, {
    startY: 78,
    head: [['Metric', 'Score', 'Change']],
    body: metrics.map(m => [
      m.name,
      `${m.score}%`,
      m.change > 0 ? `+${m.change}%` : `${m.change}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Sessions Table
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Recent Sessions', 14, finalY + 10);

  autoTable(doc, {
    startY: finalY + 14,
    head: [['Date', 'Type', 'Duration', 'Score']],
    body: sessions.map(s => [
      s.date,
      s.type,
      s.duration,
      `${s.score}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  doc.save(`${filename}.pdf`);
}

/**
 * Export session data to CSV
 */
export function exportSessionDataCSV(
  sessions: Array<{
    date: string;
    type: string;
    duration: string;
    score: number;
    notes?: string;
  }>,
  filename: string = 'session-data'
) {
  exportToCSV(sessions, filename, ['date', 'type', 'duration', 'score', 'notes']);
}

/**
 * Export metric scores to CSV
 */
export function exportMetricScoresCSV(
  metrics: Array<{
    metric: string;
    score: number;
    date: string;
  }>,
  filename: string = 'metric-scores'
) {
  exportToCSV(metrics, filename, ['metric', 'score', 'date']);
}

/**
 * Export EI metrics report to PDF
 */
export function exportEIMetricsReportPDF(
  metrics: Array<{
    name: string;
    score: number;
    description: string;
  }>,
  overallScore: number,
  filename: string = 'ei-metrics-report'
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Behavioral Metrics Report', 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  // Overall Score
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text(`Overall Score: ${overallScore}%`, 14, 42);

  // Metrics Details
  doc.setFontSize(12);
  doc.text('Detailed Metrics', 14, 54);

  autoTable(doc, {
    startY: 58,
    head: [['Metric', 'Score', 'Description']],
    body: metrics.map(m => [
      m.name,
      `${m.score}%`,
      m.description
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      2: { cellWidth: 80 }
    }
  });

  // Save
  doc.save(`${filename}.pdf`);
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatExportDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(base: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${base}-${timestamp}`;
}
