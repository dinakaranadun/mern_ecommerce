import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [12, 24, 36, 48],
  showItemsPerPage = true,
  showInfo = true,
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Left  */}
      {showInfo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startItem} to {endItem} of {totalItems}
          </span>
          {showItemsPerPage && onItemsPerPageChange && (
            <>
              <span className="hidden sm:inline">|</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => onItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="h-9 w-9 p-0"
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;