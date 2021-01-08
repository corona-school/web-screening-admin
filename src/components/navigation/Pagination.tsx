import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import "./Pagination.less";

export function Pagination({ page, setPage, hasNextPage }: { page: number, setPage(page: number): void, hasNextPage?: boolean }) {
    return <div className="pagination">
        <Button type="primary" icon={<LeftOutlined/>} onClick={() => setPage(page - 1)} disabled={page <= 0} />
        <div className="pagination-number">{page + 1}</div>
        <Button type="primary" icon={<RightOutlined />} onClick={() => setPage(page + 1)} disabled={!hasNextPage} />
    </div>
}