// ---- 설정: CDN 우선, 실패 시 로컬 폴백 ----
//const CDN_URL = "https://cdn.example.com/hexagrams.json?v=2025-10-18"; // 필요 시 교체
const LOCAL_URL = "../data/yookhyo.json";

const cat = document.querySelector("#cat");
const out = document.querySelector("#out");
const imgEl = document.querySelector("#card");
const numEl = document.querySelector("#num");
const nameEl = document.querySelector("#name");
const descEl = document.querySelector("#desc");
const tipsEl = document.querySelector("#tips");
const btnClient = document.querySelector("#roll-client");
const btnServer = document.querySelector("#roll-server");

let hexMap = new Map();

async function loadHexagrams() {
    let res;
    try {
        res = await fetch(CDN_URL, { cache: "force-cache", mode: "cors" });
        if (!res.ok) throw new Error("CDN fetch failed: " + res.status);
    } catch {
        res = await fetch(LOCAL_URL, { cache: "no-store" });
    }
    const list = await res.json();
    hexMap = new Map(list.map(h => [h.no, h]));
}
function imgPathByNumber(n) {
    const cardNumber = String(n).padStart(2, "0");
    return `/static/image/card_${cardNumber}.png`;        // 필요하면 .webp 로 바꿔도 됨
}
function render(number) {
    const h = hexMap.get(number);

    console.log('h는?:', h);
    console.log('nameEl?', nameEl);
    console.log('descEl?', descEl);

    const tip = h?.tips?.[cat.value];
    imgEl.src = imgPathByNumber(number);
    imgEl.alt = `${h?.fullname ?? ""} ${h?.name ?? ""}`.trim();
    numEl.textContent = `카테고리: ${cat.value} 
    번호: ${number} · ${h?.fullname ?? ""} · ${h?.fortune ?? ""}`;
    nameEl.textContent = h?.name ?? "";
    descEl.textContent = tip ?? h?.desc ?? "";
    out.hidden = false;
}

// 클라이언트 랜덤 (새로고침 없이 즉시)
btnClient.addEventListener("click", () => {
    if (!hexMap.size) return alert("데이터가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.");
    const n = Math.floor(Math.random() * 64) + 1;
    render(n);
});

// 서버 랜덤(API 사용 — 서버에서 규칙/로그 통제 가능)
btnServer.addEventListener("click", async () => {
    try {
        const r = await fetch("/api/roll");
        const { number } = await r.json();
        render(number);
    } catch (e) {
        console.error(e);
        alert("서버 랜덤 호출에 실패했습니다.");
    }
});

// 초기 데이터 로드
loadHexagrams().catch(err => {
    console.error(err);
    alert("파일 로드에 실패했습니다! JSON/CDN에 이상이 없는지 살펴주세요.");
});
