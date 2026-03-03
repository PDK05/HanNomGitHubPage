function encryptToPayload(plainText) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(plainText);
    const n = bytes.length;

    // 1. Tạo mảng chỉ mục I (đã bị xáo trộn ngẫu nhiên)
    let I = Array.from({length: n}, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [I[i], I[j]] = [I[j], I[i]];
    }

    // 2. Tạo mảng P và mã hóa theo đúng logic của file gốc
    let P = new Uint8Array(n);
    let seed = 0xdeadbeef;
    const nextK = () => {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return (seed >>> 0) & 0xFF;
    };

    for (let i = 0; i < n; i++) {
        let k = nextK();
        let originalPos = I[i];
        let originalByte = bytes[originalPos];
        
        // Đảo ngược logic giải mã để thành mã hóa:
        // P[i] = (Byte ^ k) + offset
        let encryptedByte = (originalByte ^ k) + (i % 251);
        P[i] = encryptedByte & 0xFF;
    }

    return { P: Array.from(P), I: I };
}

// Chạy thử với nội dung CSV của bạn
const myCSV = `user,pass\nadmin,123456\nstaff,password`;
const result = encryptToPayload(myCSV);

console.log("Mảng P của bạn (Dán vào __ENCODED__):");
console.log(result.P.join(', '));
console.log("\nMảng I của bạn (Dán vào __INDEX__):");
console.log(result.I.join(', '));
