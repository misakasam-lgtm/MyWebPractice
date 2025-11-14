//页面用

function SwitchCard(Card) {
   const register = document.getElementById("RegisterCard")
   const login =    document.getElementById("LoginCard")
    if (Card === "register") {
        register.classList.add("active")
        login.classList.remove("active")
    }
    if (Card === "login") {
        login.classList.add("active")
        register.classList.remove("active")
    }
}
function loadAnime(a) {
    if(a === "run"){document.getElementById("logAnime").style.display = "flex"}
    if(a === "stop"){document.getElementById("logAnime").style.display = "none"}
}
//登录用
async function registerUser() {
    
    const safeNamePattern = /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/;
    const invite = document.getElementById("invite").value.trim()
    const inviteCode = await sha256(invite)
    const ReNickName = document.getElementById("ReName").value.trim();
    const RePassword = document.getElementById("RePassword").value;
    const  RePassword2 = document.getElementById("RePassword2").value;

    try {
        loadAnime("run");
        if (!ReNickName || !RePassword || !RePassword2 || !invite) {
            alert("请填写完整");
            return;
        }
        if (!safeNamePattern.test(ReNickName)) {
            alert("昵称有违规字符喵！");
            return;
        }
        if (RePassword !== RePassword2) {
            alert("两次密码不一致")
            return
        }
        const hashedPassword = await sha256(RePassword2);
        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "register",
                payload: {
                    name: ReNickName,
                    password: hashedPassword,
                    invite: inviteCode
                }
            })
        })
        const result = await res.json();
   
    if(!res.ok){
        alert(result.message||"注册失败了喵")
        return
    }
    if(!result.success){
        alert(result.message||"注册失败了喵")
        return
        
    }
    alert(result.message)
    SwitchCard('login')
    }catch(error){alert("未知错误:"+error)}
    finally { loadAnime("stop");}
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}

async function loginUser() {
    const nickName = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value
    try {
         loadAnime("run");
        if (!nickName || !password) {
            alert("请输入昵称及密码")
            return;
        }
        const hashedPassword = await sha256(password);

        const res = await fetch("https://rvzfjypuxbptqxyxcmzu.supabase.co/functions/v1/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                action: "login",
                payload: {
                    name: nickName,
                    password: hashedPassword,
                }
            })
        })
        const result = await res.json();
        loadAnime("stop");
        if (!res.ok) {
            alert(result.message || "登录失败了喵")
            return
        }

        if (!result.success) {
            alert(result.message || "登录失败");
            return;
        }
        localStorage.setItem('logPlayerID', result.id);
        localStorage.setItem('logPlayerName', result.name)
        sessionStorage.setItem("justLoggedIn", "true")
        console.log(result.message);
        window.location.href = "./MainPage.html";
    } catch (error) {
        alert("未知错误");
        console.log(error);
    } finally {
        loadAnime("stop");
    }
}
