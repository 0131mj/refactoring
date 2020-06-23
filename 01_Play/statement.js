'use strict';
import createStatementData from "./createStatementData.js";

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
    }

    result += `총액 : ${usd(data.totalAmount)}\n`;
    result += `적립 포인트 : ${data.totalVolumeCredits}점\n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD", minimumFractionDigits: 2
        }).format(aNumber / 100);
    }
}

Promise.all([
    fetch('./plays.json'),
    fetch('./invoices.json')
]).then(async ([playsData, invoicesData]) => {
    const plays = await playsData.json();
    const invoices = await invoicesData.json();
    return {plays, invoices};
}).then((data) => {
    const {plays, invoices} = data;
    const result = statement(invoices[0], plays);
    console.log(result);
}).catch((err) => {
    console.error(err);
});



