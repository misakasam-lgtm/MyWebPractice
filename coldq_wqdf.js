//登录用

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
     const supabaseUrl = 'https://rvzfjypuxbptqxyxcmzu.supabase.co'
     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2emZqeXB1eGJwdHF4eXhjbXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODIwNTksImV4cCI6MjA3Nzc1ODA1OX0.PYx4KzJgafbG8O_PPJbYQCVJs-iwTjIvVFoeiau0vnc'
     const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

async function registerUser() {
    const inviteCode = await sha256(document.getElementById("invite").value.trim())
    const ReNickName = document.getElementById("ReName").value.trim();
    const RePassword = document.getElementById("RePassword").value;
    const  RePassword2 = document.getElementById("RePassword2").value;
    const{data:invite_key,error:updateError} = await supabaseClient
        .from ("invite_key")
        .select("key")
        .eq("id",1)
        .maybeSingle()
    if(updateError){
        console.log("error")
        return
    }
    if (inviteCode !== invite_key.key) {
        alert("请向管理员询问正确的喵请码")
        return
    }

    if(!ReNickName||!RePassword||!RePassword2) {
        alert("请填写完整");
        return;
    }
    if(RePassword !== RePassword2) {
        alert("两次密码不一致")
        return
    }
     const hashedPassword = await sha256(RePassword);
    
    const {data:existing, error:checkError} = await supabaseClient
        .from('player')
        .select('id')
        .eq('name',ReNickName)
        .maybeSingle()
    
    if(checkError){ console.log(checkError); return}
    if(existing){alert('昵称已存在');return}
    
    const {data, error} = await supabaseClient
        .from('player')
        .insert([{name:ReNickName,password:hashedPassword,fish:8000}])
    if(error){alert("注册失败"); return}
    alert('欢迎加入喵屋')
    SwitchCard('login')
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
    if(!nickName || !password){
        alert("请输入昵称及密码")
        return;
    }
    const hashedPassword = await sha256(password);
    
    const {data, error} = await supabaseClient
    .from('player')
    .select('id,name')
    .eq('name',nickName)
    .eq('password',hashedPassword)
    .maybeSingle()
    
    if(error){
        console.log(error)
        alert("电波异常喵")
        return;
    }
    if(!data){
        alert("昵称或密码错误")
        return
    }
    localStorage.setItem('logPlayerID',data.id);
    localStorage.setItem('logPlayerName',data.name)
    alert("欢迎回家喵")
    window.location.href = "./MainPage.html";
    
}