
     async function loadHeadLine() {
         const res = await fetch("topLine.html")
         document.getElementById("HeadLine").innerHTML = await res.text();

         const SideShowBtm = document.getElementById('sideShowBtm');
         const shutdownBtm = document.getElementById('SideBackBtm');
         const headLineName = document.getElementById('HeadLineName')
         const sideMenu = document.getElementById('sideMenu')
         const menu_user_name = document.getElementById('menu_user_name');
         const name = localStorage.getItem('userName')
         headLineName.textContent = document.title

         SideShowBtm.addEventListener('click', () => {
             showMenu()
             SideShowUserName()
         })
         shutdownBtm.addEventListener('click', () => {
             shutdownMenu()
         })
         function showMenu() {
             sideMenu.classList.add('show');
             shutdownBtm.classList.add('show');
         }
         function shutdownMenu() {
             sideMenu.classList.remove('show');
             shutdownBtm.classList.remove('show');
         }
         function SideShowUserName() {
             menu_user_name.textContent = `${name}`;
         }
     }


