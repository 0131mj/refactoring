'use strict';
import createStatementData from "./createStatementData.js";

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>`;
    result += `<table>`;
    result += `<tr>
                    <th>연극</th>
                    <th>좌석수</th>
                    <th>금액</th>
               </tr>`;
    for (let perf of data.performances) {
        result += `  
                <tr>
                    <td>${perf.play.name}</td>
                    <td>(${perf.audience}석)</td>
                    <td>${usd(perf.amount)}</td>
                </tr>`;
    }
    result += `</table>\n`;
    result += `<p>총액 : <em>${usd(data.totalAmount)}</em></p>`;
    result += `<p>적립 포인트 : <em>${data.totalVolumeCredits}</em>점</p>`;
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
    document.body.innerHTML = result;
}).catch((err) => {
    console.error(err);
});



