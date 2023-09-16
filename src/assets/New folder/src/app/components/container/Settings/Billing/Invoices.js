import { Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DownloadCloudIcon from "app/static/svg/DownloadCloudIcon";
import { BillingContext } from "./index";
import isEmpty from "lodash/isEmpty";
import { getInvoices } from "@store/billing/billing";
import { getDateTime, getDMYDate } from "@tools/helpers";
import Spinner from "@presentational/reusables/Spinner";
import billingConfig from "@constants/Billing/index";

const { Option } = Select;
const ENTRIES_ALL = "All";
const ENTRIES_OPTIONS = [10, 20, 50, 100, ENTRIES_ALL];
const layoutClasses = {
    invoiceNo: "col-5",
    planName: "col-4",
    amount: "col-3",
    date: "col-4",
    due: "col-3",
    pay_btn: "col-3",
    download: "col-2",
};

export default function Invoices() {
    const [showMaxEntries, setShowMaxEntries] = useState(ENTRIES_OPTIONS[0]);
    const { handleManageSubscriptionVisible } = useContext(BillingContext);
    const {
        invoices: { loading, data },
    } = useSelector((state) => state.billing);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isEmpty(data)) dispatch(getInvoices());
    }, []);

    const handleEntriesChange = (value) => {
        setShowMaxEntries(value);
    };
    return (
        <div className="app__invoices">
            <div className="app__invoices--header">
                <p className="font20 lineHeightN bold600">Payment Invoices</p>
                <div className="app__invoices--headerRight">
                    <div className="app__invoices--entries">
                        <p className="font16 lineHeightN marginR13">Show</p>
                        <Select
                            defaultValue={showMaxEntries}
                            className="app__invoices--dropdown"
                            onChange={handleEntriesChange}
                            getPopupContainer={() =>
                                document.querySelector(
                                    ".app__invoices--dropdown"
                                )
                            }
                        >
                            {ENTRIES_OPTIONS.map((item) => (
                                <Option key={item} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                        <p className="font16 lineHeightN marginL13">Entries</p>
                    </div>
                    {/* <button className="app__billing--btn marginL30">
                        <DownloadCloudIcon />
                        <span className="marginL7">Download All</span>
                    </button> */}
                </div>
            </div>
            <div className="app__invoices--table">
                <div className="app__billing--tableLabels row">
                    <p
                        className={`app__billing--tableLabel ${layoutClasses.invoiceNo}`}
                    >
                        Invoice No.
                    </p>
                    <p
                        className={`app__billing--tableLabel ${layoutClasses.planName}`}
                    >
                        Plan Name
                    </p>
                    <p
                        className={`app__billing--tableLabel ${layoutClasses.amount}`}
                    >
                        Amount
                    </p>
                    <p
                        className={`app__billing--tableLabel ${layoutClasses.date}`}
                    >
                        Date
                    </p>
                    <p
                        className={`app__billing--tableLabel ${layoutClasses.due}`}
                    >
                        Status
                    </p>
                </div>
                <div
                    className={`app__invoices--tableCard ${
                        loading ? "loading" : ""
                    }`}
                >
                    <Spinner loading={loading}>
                        {data
                            ?.slice(
                                0,
                                showMaxEntries === ENTRIES_ALL
                                    ? undefined
                                    : showMaxEntries
                            )
                            .map((item) => (
                                <div
                                    className="app__invoices--tableCardItem row"
                                    key={item?.id}
                                >
                                    <p
                                        className={`font16 bold600 margin0 lineHeightN ${layoutClasses.invoiceNo}`}
                                    >
                                        {item?.invoice_no}
                                    </p>
                                    <p
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.planName}`}
                                    >
                                        {item?.plan_name}
                                    </p>
                                    <p
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.amount}`}
                                    >
                                        {`${
                                            billingConfig[
                                                item?.currency?.toUpperCase()
                                            ]
                                        }`}
                                        {item?.total_price}
                                    </p>
                                    <p
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.date}`}
                                    >
                                        {getDateTime(
                                            item?.invoice_date * 1000,
                                            "date"
                                        )}
                                    </p>
                                    <div className={`${layoutClasses.due}`}>
                                        {item?.invoice_status === "issued" ? (
                                            <button className="app__billing--btn">
                                                DUE
                                            </button>
                                        ) : item?.invoice_status ===
                                          "cancelled" ? (
                                            <button className="app__billing--btn cancelled uppercase">
                                                cancelled
                                            </button>
                                        ) : item?.invoice_status === "paid" ? (
                                            <button className="app__billing--btn paid">
                                                PAID
                                            </button>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.pay_btn}`}
                                    >
                                        {item?.invoice_status === "issued" && (
                                            <button
                                                onClick={() => {
                                                    window.open(
                                                        item?.invoice_download_url
                                                    );
                                                }}
                                                className="app__billing--btn pay_now_btn"
                                            >
                                                PAY NOW
                                            </button>
                                        )}
                                    </div>
                                    <div
                                        className={`${layoutClasses.download}`}
                                    >
                                        <a
                                            className="primary_cl--important"
                                            href={item?.invoice_download_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <DownloadCloudIcon />
                                        </a>
                                    </div>
                                </div>
                            ))}
                    </Spinner>
                </div>
            </div>
        </div>
    );
}
