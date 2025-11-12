import React from 'react';

// This file contains shared markdown rendering components for consistency.

/**
 * General purpose Markdown Renderer.
 * Supports:
 * - Headings (##, ###)
 * - Bold text (**...**)
 * - Unordered lists (* ...)
 * - Tables (| ... |)
 */
export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const parseInline = (line: string): React.ReactNode[] => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const renderableElements: React.ReactNode[] = [];
    const lines = text.split('\n');
    
    let currentListItems: React.ReactNode[] = [];
    let currentTable: { headers: string[], rows: string[][] } | null = null;

    const flushList = () => {
        if (currentListItems.length > 0) {
            renderableElements.push(<ul key={`ul-${renderableElements.length}`} className="list-disc list-inside space-y-1 my-4 pr-5">{currentListItems}</ul>);
            currentListItems = [];
        }
    };

    const flushTable = () => {
        if (currentTable) {
            renderableElements.push(
                <div key={`table-wrapper-${renderableElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {currentTable.headers.map((header, j) => (
                                    <th key={j} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {parseInline(header)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentTable.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                                            {parseInline(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            currentTable = null;
        }
    };

    lines.forEach((line, i) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('|')) {
            flushList();
            const cells = trimmedLine.split('|').slice(1, -1).map(c => c.trim());
            
            if (cells.every(c => c === '')) {
                return;
            }

            if (!currentTable) {
                currentTable = { headers: cells, rows: [] };
            } else if (!trimmedLine.match(/^\|(\s*:?-+:?\s*\|)+$/)) {
                if (cells.length === currentTable.headers.length) {
                    currentTable.rows.push(cells);
                }
            }
        } else {
            flushList();
            flushTable();

            if (line.startsWith('## ')) {
                renderableElements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3 border-b-2 border-teal-200 pb-2">{parseInline(line.substring(3))}</h2>);
            } else if (line.startsWith('### ')) {
                renderableElements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-2">{parseInline(line.substring(4))}</h3>);
            } else if (trimmedLine.startsWith('* ')) {
                currentListItems.push(<li key={i}>{parseInline(trimmedLine.substring(2))}</li>);
            } else if (trimmedLine) {
                renderableElements.push(<p key={i} className="my-4 leading-relaxed text-gray-700">{parseInline(line)}</p>);
            }
        }
    });
    
    flushList();
    flushTable();

    return <>{renderableElements}</>;
};

/**
 * Chat-specific Markdown Renderer.
 * Optimized for conversational content.
 * Supports:
 * - Headings (##, ###)
 * - Bold text (**...**)
 * - Unordered lists (* ...)
 */
export const ChatMarkdownRenderer: React.FC<{ text: string; size?: 'normal' | 'small' }> = ({ text, size = 'normal' }) => {
    const parseInline = (line: string): React.ReactNode[] => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };
    
    const renderableElements: React.ReactNode[] = [];
    const lines = text.split('\n');
    let currentListItems: React.ReactNode[] = [];

    const flushList = () => {
        if (currentListItems.length > 0) {
            renderableElements.push(
                <ul key={`ul-${renderableElements.length}`} className="list-disc list-inside space-y-1 my-2 pr-4">
                    {currentListItems}
                </ul>
            );
            currentListItems = [];
        }
    };

    const h2Class = size === 'small' ? 'font-bold text-base mt-3 mb-1' : 'font-bold text-lg mt-3 mb-1';
    const h3Class = size === 'small' ? 'font-semibold text-sm mt-2 mb-1' : 'font-semibold text-base mt-2 mb-1';
    const pClass = size === 'small' ? 'my-1 text-sm' : 'my-1';

    lines.forEach((line, i) => {
        const trimmedLine = line.trim();

        if (!trimmedLine.startsWith('* ')) {
            flushList();
        }

        if (line.startsWith('## ')) {
            renderableElements.push(<h2 key={i} className={h2Class}>{parseInline(line.substring(3))}</h2>);
        } else if (line.startsWith('### ')) {
            renderableElements.push(<h3 key={i} className={h3Class}>{parseInline(line.substring(4))}</h3>);
        } else if (trimmedLine.startsWith('* ')) {
            currentListItems.push(<li key={i}>{parseInline(trimmedLine.substring(2))}</li>);
        } else if (trimmedLine) {
            renderableElements.push(<p key={i} className={pClass}>{parseInline(line)}</p>);
        }
    });

    flushList();

    return <>{renderableElements}</>;
};