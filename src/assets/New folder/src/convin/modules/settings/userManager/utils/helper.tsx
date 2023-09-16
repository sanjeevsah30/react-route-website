export function paginator<T>(
    items: T[] | undefined = [],
    current_page: number,
    per_page_items: number
) {
    const page = current_page || 1,
        per_page = per_page_items,
        offset = (page - 1) * per_page,
        paginatedItems = items.slice(offset).slice(0, per_page_items),
        total_pages = Math.ceil(items.length / per_page);

    return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        data: paginatedItems,
    };
}
