    const playerID = localStorage.getItem('logPlayerID');
    const playerName = localStorage.getItem('logPlayerName');

    async function loadFish() {
        if (!playerID) {
            alert("请先登录喵")
            window.location.href = "./index.html";
        }
        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/addfish", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "load",
                payload: {
                id: playerID,
                name: playerName,
                }
            })
        })
        const result = await res.json();
        if(!res.ok){
        alert(result.message||"更新鱼干失败喵")
        return
    }
        if(!result.success){
            alert(result.message || "更新鱼干失败喵")
            return
        }
    document.getElementById("fish").innerHTML=result.fish
    }

    async function addFish(amount) {
        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/addfish", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "add",
                payload: {
                id: playerID,
                name: playerName,
                amount: amount
                }
            })
        })
        const result = await res.json();
        if(!res.ok) {
            alert(result.message || "更新鱼干失败喵")
        }
        if(!result.success){
            alert(result.message || "操作失败喵")
        }
        document.getElementById("fish").innerHTML = result.fish;
    }

    async function feedPet(amount) {
        if (!playerID) {
            alert("请先登录喵")
            window.location.href = "./index.html";
        }
        await addFish(-amount);
        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/addfish", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "feedPet",
                payload: {
                id: playerID,
                name: playerName,
                amount: amount
                }
            })
        })
        const result = await res.json();
        if(!res.ok) {
            alert(result.message || "投喂失败喵")
            return
        }
        if(!result.success){
            alert(result.message || "投喂失败喵")
            return
        }
        document.getElementById("petEXP").innerHTML = result.petEXP;
        localStorage.setItem('petEXP', result.petEXP)
        localStorage.setItem('petEnemy', result.petEnemy)
    }
    async function newEnemy(isWin) {
        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/addfish", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "newEnemy",
                payload: {
                id: playerID,
                name: playerName,
                win: isWin
                }
            })
        })
        const result = await res.json();
        if(!res.ok) {
            alert(result.message || "战斗结算出现问题")
            return
        }
        if(!result.success){
            alert(result.message || "战斗结算出现问题")
            return
        }
        localStorage.setItem('petEnemy', result.petEnemy)
    }
