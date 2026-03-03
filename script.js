let data = [];

async function loadCSV() {
    const response = await fetch("data.csv");
    const text = await response.text();

    const rows = text.split("\n").slice(1); // bỏ header

    data = rows.map(row => {
        const cols = row.split(",");
        return {
            han: cols[0],
            reading: cols[1],
            meaning: cols[2]
        };
    });
}

function lookup() {
    const input = document.getElementById("search").value.trim();
    const resultDiv = document.getElementById("result");

    const found = data.find(item => item.han === input);

    if (found) {
        resultDiv.innerHTML = `
            Âm: ${found.reading} <br>
            Nghĩa: ${found.meaning}
        `;
    } else {
        resultDiv.innerHTML = "Không tìm thấy";
    }
}

loadCSV();
