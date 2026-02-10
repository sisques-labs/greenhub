import { cn } from '@/shared/lib/utils';
import { DEFAULT_PER_PAGE_OPTIONS } from '@/shared/constants/pagination.constants';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import * as React from 'react';
import { Checkbox } from './checkbox';
import { Input } from './input';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';
import { Skeleton } from './skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

export type SortDirection = 'ASC' | 'DESC';

export interface Sort {
	field: string;
	direction: SortDirection;
}

export interface ColumnDef<T> {
	/**
	 * Unique identifier for the column
	 */
	id: string;
	/**
	 * Header label to display
	 */
	header: string;
	/**
	 * Accessor function or key to get the value from the row data
	 */
	accessor?: keyof T | ((row: T) => React.ReactNode);
	/**
	 * Custom cell renderer. If provided, this takes precedence over accessor
	 */
	cell?: (row: T) => React.ReactNode;
	/**
	 * Whether this column is sortable
	 */
	sortable?: boolean;
	/**
	 * Field name to use for sorting (defaults to column id)
	 */
	sortField?: string;
	/**
	 * Additional className for the header cell
	 */
	headerClassName?: string;
	/**
	 * Additional className for the body cells in this column
	 */
	cellClassName?: string;
	/**
	 * Whether this column is editable
	 */
	editable?: boolean;
	/**
	 * Custom input type for editable cells (defaults to "text")
	 */
	inputType?: 'text' | 'number' | 'email' | 'tel' | 'url';
}

export interface DataTableProps<T> {
	/**
	 * Array of data to display
	 */
	data: T[];
	/**
	 * Column definitions
	 */
	columns: ColumnDef<T>[];
	/**
	 * Function to get a unique key for each row
	 */
	getRowId?: (row: T) => string | number;
	/**
	 * Callback when a row is clicked
	 */
	onRowClick?: (row: T) => void;
	/**
	 * Current sort configuration
	 */
	sorts?: Sort[];
	/**
	 * Callback when sort changes
	 */
	onSortChange?: (sorts: Sort[]) => void;
	/**
	 * Message to display when there's no data
	 */
	emptyMessage?: string;
	/**
	 * Additional className for the table
	 */
	className?: string;
	/**
	 * Additional className for table rows
	 */
	rowClassName?: string | ((row: T) => string);
	/**
	 * Callback when a cell is edited
	 */
	onCellEdit?: (row: T, columnId: string, newValue: string) => void;
	/**
	 * Enable row selection with checkboxes
	 */
	enableRowSelection?: boolean;
	/**
	 * Selected row IDs
	 */
	selectedRowIds?: Set<string | number>;
	/**
	 * Callback when selection changes
	 */
	onSelectionChange?: (selectedRowIds: Set<string | number>) => void;
	/**
	 * Enable pagination
	 */
	paginated?: boolean;
	/**
	 * Current page (1-indexed)
	 */
	page?: number;
	/**
	 * Total number of pages
	 */
	totalPages?: number;
	/**
	 * Callback when page changes
	 */
	onPageChange?: (page: number) => void;
	/**
	 * Number of items per page
	 */
	perPage?: number;
	/**
	 * Options for items per page selector
	 */
	perPageOptions?: readonly number[];
	/**
	 * Callback when items per page changes
	 */
	onPerPageChange?: (perPage: number) => void;
	/**
	 * Loading state
	 */
	isLoading?: boolean;
	/**
	 * Number of skeleton rows to show when loading
	 */
	loadingRowCount?: number;
	/**
	 * Wrap table in a bordered container
	 */
	bordered?: boolean;
}

/**
 * Generic DataTable component for displaying tabular data
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   {
 *     id: "name",
 *     header: "Name",
 *     accessor: "name",
 *     editable: true,
 *   },
 *   {
 *     id: "email",
 *     header: "Email",
 *     accessor: (row) => row.email,
 *     editable: true,
 *     inputType: "email",
 *   },
 *   {
 *     id: "actions",
 *     header: "Actions",
 *     cell: (row) => <Button onClick={() => handleEdit(row)}>Edit</Button>,
 *   },
 * ];
 *
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   getRowId={(row) => row.id}
 *   onRowClick={(row) => console.log(row)}
 *   onCellEdit={(row, columnId, newValue) => {
 *     console.log(`Editing ${columnId} of row ${row.id} to ${newValue}`);
 *     // Update your data here
 *   }}
 * />
 * ```
 */
export function DataTable<T extends object>({
	data,
	columns,
	getRowId,
	onRowClick,
	sorts = [],
	onSortChange,
	emptyMessage = 'No data found',
	className,
	rowClassName,
	onCellEdit,
	enableRowSelection = false,
	selectedRowIds,
	onSelectionChange,
	paginated = false,
	page = 1,
	totalPages = 1,
	onPageChange,
	perPage = 10,
	perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
	onPerPageChange,
	isLoading = false,
	loadingRowCount,
	bordered = false,
}: DataTableProps<T>) {
	const [editingCell, setEditingCell] = React.useState<{
		rowId: string | number;
		columnId: string;
	} | null>(null);
	const [editValue, setEditValue] = React.useState<string>('');

	// Internal state for selection if not controlled
	const [internalSelectedRowIds, setInternalSelectedRowIds] = React.useState<
		Set<string | number>
	>(new Set());

	// Use controlled or internal state
	const currentSelectedRowIds =
		selectedRowIds !== undefined ? selectedRowIds : internalSelectedRowIds;
	const setSelectedRowIds = React.useCallback(
		(newSelection: Set<string | number>) => {
			if (onSelectionChange) {
				onSelectionChange(newSelection);
			} else {
				setInternalSelectedRowIds(newSelection);
			}
		},
		[onSelectionChange],
	);
	const handleSort = (column: ColumnDef<T>) => {
		if (!column.sortable || !onSortChange) return;

		const sortField = column.sortField || column.id;
		const currentSort = sorts.find((s) => s.field === sortField);

		let newSorts: Sort[];

		if (!currentSort) {
			// No sort for this column, add ASC
			newSorts = [...sorts, { field: sortField, direction: 'ASC' }];
		} else if (currentSort.direction === 'ASC') {
			// Change from ASC to DESC
			newSorts = sorts.map((s) =>
				s.field === sortField ? { ...s, direction: 'DESC' } : s,
			);
		} else {
			// Remove sort (DESC -> no sort)
			newSorts = sorts.filter((s) => s.field !== sortField);
		}

		onSortChange(newSorts);
	};

	const getSortIcon = (column: ColumnDef<T>) => {
		if (!column.sortable) return null;

		const sortField = column.sortField || column.id;
		const currentSort = sorts.find((s) => s.field === sortField);

		if (!currentSort) {
			return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
		}

		return currentSort.direction === 'ASC' ? (
			<ArrowUp className="ml-2 h-4 w-4" />
		) : (
			<ArrowDown className="ml-2 h-4 w-4" />
		);
	};
	const getRowKey = (row: T, index: number): string | number => {
		if (getRowId) {
			return getRowId(row);
		}
		// Try to find common id fields
		if ('id' in row && typeof row.id === 'string') {
			return row.id;
		}
		if ('id' in row && typeof row.id === 'number') {
			return row.id;
		}
		return index;
	};

	const getCellValue = (column: ColumnDef<T>, row: T): React.ReactNode => {
		// If custom cell renderer is provided, use it
		if (column.cell) {
			return column.cell(row);
		}

		// If accessor is a function, call it
		if (typeof column.accessor === 'function') {
			return column.accessor(row);
		}

		// If accessor is a key, get the value
		if (column.accessor) {
			const value = row[column.accessor];
			return value !== null && value !== undefined ? String(value) : '-';
		}

		return '-';
	};

	const getCellRawValue = (column: ColumnDef<T>, row: T): string => {
		// For editable cells, we need the raw value, not the rendered cell
		// If accessor is a function, call it and convert to string
		if (typeof column.accessor === 'function') {
			const value = column.accessor(row);
			return value !== null && value !== undefined ? String(value) : '';
		}

		// If accessor is a key, get the value
		if (column.accessor) {
			const value = row[column.accessor];
			return value !== null && value !== undefined ? String(value) : '';
		}

		// Fallback: try to get value from row using column id
		const value = row[column.id as keyof T];
		return value !== null && value !== undefined ? String(value) : '';
	};

	const handleCellDoubleClick = (
		row: T,
		column: ColumnDef<T>,
		rowKey: string | number,
	) => {
		if (!column.editable || !onCellEdit) return;

		const rawValue = getCellRawValue(column, row);
		setEditingCell({ rowId: rowKey, columnId: column.id });
		setEditValue(rawValue);
	};

	const handleCellEditSave = () => {
		if (!editingCell || !onCellEdit) return;

		const row = data.find((r) => {
			const rowKey = getRowKey(r, data.indexOf(r));
			return rowKey === editingCell.rowId;
		});

		if (row) {
			onCellEdit(row, editingCell.columnId, editValue);
		}

		setEditingCell(null);
		setEditValue('');
	};

	const handleCellEditCancel = () => {
		setEditingCell(null);
		setEditValue('');
	};

	const handleCellEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleCellEditSave();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			handleCellEditCancel();
		}
	};

	const getRowClassNames = (row: T): string => {
		const baseClass = onRowClick ? 'cursor-pointer' : '';
		if (typeof rowClassName === 'function') {
			return cn(baseClass, rowClassName(row));
		}
		return cn(baseClass, rowClassName);
	};

	// Selection handlers
	const handleRowSelection = (rowKey: string | number, checked: boolean) => {
		const newSelection = new Set<string | number>(currentSelectedRowIds);
		if (checked) {
			newSelection.add(rowKey);
		} else {
			newSelection.delete(rowKey);
		}
		setSelectedRowIds(newSelection);
	};

	const handleSelectAll = (checked: boolean | 'indeterminate') => {
		const isChecked = checked === true;
		if (isChecked) {
			const allRowIds = new Set<string | number>(
				data.map((row, index) => getRowKey(row, index)),
			);
			setSelectedRowIds(allRowIds);
		} else {
			setSelectedRowIds(new Set<string | number>());
		}
	};

	const isAllSelected =
		data.length > 0 &&
		data.every((row, index) => {
			const rowKey = getRowKey(row, index);
			return currentSelectedRowIds.has(rowKey);
		});

	const isIndeterminate =
		!isAllSelected &&
		data.some((row, index) => {
			const rowKey = getRowKey(row, index);
			return currentSelectedRowIds.has(rowKey);
		});

	// Pagination helpers
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages && onPageChange) {
			onPageChange(newPage);
		}
	};

	const renderPagination = () => {
		if (!paginated) return null;

		const effectiveTotalPages = Math.max(1, totalPages);
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 7;

		if (effectiveTotalPages <= maxVisible) {
			for (let i = 1; i <= effectiveTotalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (page > 3) {
				pages.push('ellipsis');
			}

			const start = Math.max(2, page - 1);
			const end = Math.min(effectiveTotalPages - 1, page + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (page < effectiveTotalPages - 2) {
				pages.push('ellipsis');
			}

			pages.push(effectiveTotalPages);
		}

		return (
			<div className="flex items-center justify-between gap-4 py-4">
				{onPerPageChange && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							Items per page:
						</span>
						<Select
							value={perPage.toString()}
							onValueChange={(value) => {
								const newPerPage = parseInt(value, 10);
								onPerPageChange(newPerPage);
								if (onPageChange) {
									onPageChange(1);
								}
							}}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{perPageOptions.map((option) => (
									<SelectItem key={option} value={option.toString()}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				<div className="ml-auto">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									size="default"
									onClick={() => handlePageChange(page - 1)}
									className={cn(page === 1 && 'pointer-events-none opacity-50')}
								/>
							</PaginationItem>

							{pages.map((p, index) => (
								<PaginationItem key={index}>
									{p === 'ellipsis' ? (
										<PaginationEllipsis />
									) : (
										<PaginationLink
											size="icon"
											onClick={() => handlePageChange(p)}
											isActive={p === page}
										>
											{p}
										</PaginationLink>
									)}
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									size="default"
									onClick={() => handlePageChange(page + 1)}
									className={cn(
										page === effectiveTotalPages &&
											'pointer-events-none opacity-50',
									)}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		);
	};

	// Skeleton rendering
	const renderSkeletonRows = () => {
		const rowCount = loadingRowCount || perPage || 10;
		return Array.from({ length: rowCount }).map((_, index) => (
			<TableRow key={`skeleton-${index}`}>
				{enableRowSelection && (
					<TableCell>
						<Skeleton className="h-4 w-4" />
					</TableCell>
				)}
				{columns.map((column) => (
					<TableCell key={column.id} className={column.cellClassName}>
						<Skeleton className="h-4 w-full" />
					</TableCell>
				))}
			</TableRow>
		));
	};

	const tableContent = (
		<Table className={className}>
			<TableHeader>
				<TableRow>
					{enableRowSelection && (
						<TableHead className="w-12">
							<Checkbox
								checked={isAllSelected}
								onCheckedChange={handleSelectAll}
								aria-label="Select all rows"
							/>
						</TableHead>
					)}
					{columns.map((column) => (
						<TableHead
							key={column.id}
							className={cn(
								column.headerClassName,
								column.sortable &&
									onSortChange &&
									'cursor-pointer select-none hover:bg-muted/50',
							)}
							onClick={() => handleSort(column)}
						>
							<div className="flex items-center">
								{column.header}
								{getSortIcon(column)}
							</div>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ? (
					renderSkeletonRows()
				) : data.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={enableRowSelection ? columns.length + 1 : columns.length}
							className="text-center text-muted-foreground"
						>
							{emptyMessage}
						</TableCell>
					</TableRow>
				) : (
					data.map((row, index) => {
						const rowKey = getRowKey(row, index);
						const isRowSelected = currentSelectedRowIds.has(rowKey);
						return (
							<TableRow
								key={rowKey}
								onClick={() => onRowClick?.(row)}
								className={getRowClassNames(row)}
							>
								{enableRowSelection && (
									<TableCell
										onClick={(e) => e.stopPropagation()}
										onDoubleClick={(e) => e.stopPropagation()}
									>
										<Checkbox
											checked={isRowSelected}
											onCheckedChange={(checked: boolean | 'indeterminate') => {
												handleRowSelection(rowKey, checked === true);
											}}
											aria-label={`Select row ${rowKey}`}
										/>
									</TableCell>
								)}
								{columns.map((column) => {
									const isEditing =
										editingCell?.rowId === rowKey &&
										editingCell?.columnId === column.id;

									return (
										<TableCell
											key={column.id}
											className={cn(
												column.cellClassName,
												column.editable && 'cursor-text',
											)}
											onDoubleClick={(e) => {
												e.stopPropagation();
												handleCellDoubleClick(row, column, rowKey);
											}}
											onClick={(e) => {
												if (column.editable) {
													e.stopPropagation();
												}
											}}
										>
											{isEditing ? (
												<Input
													type={column.inputType || 'text'}
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													onBlur={handleCellEditSave}
													onKeyDown={handleCellEditKeyDown}
													className="h-8 w-full"
													autoFocus
													onClick={(e) => e.stopPropagation()}
													onDoubleClick={(e) => e.stopPropagation()}
												/>
											) : (
												getCellValue(column, row)
											)}
										</TableCell>
									);
								})}
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);

	if (!paginated && !bordered) {
		return tableContent;
	}

	return (
		<div className="space-y-0">
			{bordered ? (
				<div className="rounded-md border">{tableContent}</div>
			) : (
				tableContent
			)}
			{paginated && renderPagination()}
		</div>
	);
}
