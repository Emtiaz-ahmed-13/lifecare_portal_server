export type PaginationOptions = {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

const calculatePagination = ({
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = "desc",
}: PaginationOptions) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sortBy
        ? { [sortBy]: sortOrder }
        : undefined;

    return {
        skip,
        take,
        orderBy,
    };
};

export const paginationHelper = {
    calculatePagination,
};
