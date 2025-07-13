export const convertVndToUsd = async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/vnd.json');
    const data = await res.json();
    const rate = data.vnd.usd;
    return rate;
  } catch (e) {
    console.error('Lỗi khi lấy tỷ giá:', e);
    return 'Không thể chuyển đổi';
  }
}