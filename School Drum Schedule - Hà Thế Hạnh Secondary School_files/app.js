// Định nghĩa các biến toàn cục
let dataFolder = 'School Drum Schedule - Hà Thế Hạnh Secondary School_files';
let selectedTemplate = null;
let audioPlayer = document.getElementById('audioPlayer');
let currentListMusic = [];
let currentIndexMusic = 0;

// Hàm chính được chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    console.log("Ứng dụng đã khởi động");

    // Khởi tạo các phần tử DOM
    const scheduleTemplate = document.getElementById('scheduleTemplate');
    const scheduleList = document.getElementById('scheduleList');
    const scheduleStatus = document.getElementById('scheduleStatus');
    const addHourElement = document.getElementById('addHour');
    const startScheduleElement = document.getElementById('startSchedule');
    const stopScheduleElement = document.getElementById('stopSchedule');

    // Khởi tạo giao diện
    initializeInterface();

    // Thiết lập các sự kiện
    setupEventListeners();

    // Khởi động ứng dụng
    stopScheduleElement.click();

    // Hàm khởi tạo giao diện
    function initializeInterface() {
        populateScheduleTemplate();
        selectedTemplate = scheduleTemplateData[0];
        loadSchedule(selectedTemplate);
    }

    // Hàm thiết lập các sự kiện
    function setupEventListeners() {
        scheduleTemplate.addEventListener('change', handleTemplateChange);
        startScheduleElement.addEventListener('click', startSchedule);
        stopScheduleElement.addEventListener('click', stopSchedule);
    }

    // Hàm điền dữ liệu vào select box mẫu lịch
    function populateScheduleTemplate() {
        scheduleTemplateData.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.innerText = template.name;
            scheduleTemplate.appendChild(option);
        });
    }

    // Xử lý sự kiện khi thay đổi mẫu lịch
    function handleTemplateChange() {
        clearAllTimeouts(selectedTemplate);
        selectedTemplate = scheduleTemplateData[this.value];
        loadSchedule(selectedTemplate);
    }

    // Hàm đánh dấu một mục lịch đã hoàn thành
    function markAsCompleted(timeName) {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        scheduleItems.forEach(item => {
            if (item.querySelector('span').innerText === timeName) {
                item.classList.add('completed');
                disableScheduleItemInputs(item);
            }
        });
    }

    // Hàm vô hiệu hóa các input trong một mục lịch
    function disableScheduleItemInputs(item) {
        item.querySelector('input').disabled = true;
        item.querySelector('select').disabled = true;
        item.querySelector('.removeTime').disabled = true;
    }

    // Hàm bắt đầu lịch
    function startSchedule() {
        console.log('Bắt đầu lịch');
        const now = new Date();
        selectedTemplate.listTime.forEach(time => {
            scheduleTime(time, now);
        });
        
        updateUIForActiveSchedule();
    }

    // Hàm lên lịch cho một mục thời gian
    function scheduleTime(time, now) {
        const [hours, minutes] = time.time.split(':');
        const targetTime = new Date();
        targetTime.setHours(hours, minutes, 0, 0);

        if (targetTime > now) {
            const timeDifference = targetTime - now;
            time.relativeTime = setTimeout(() => {
                currentListMusic = [];
                console.log(`${time.name} đang reo`);
                currentListMusic.push({index: 0, url:`./${dataFolder}/sounds/${time.sound}`});
                if (time.type === 'phat_nhac') {
                    for (let i = 0; i < songNumberPlaymusic; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                //Nếu type = 'ra_choi' thì sau khi playSound timeDelay giây thì hãy phát songNumber bài nhạc bất kỳ trong listMusic (không trùng với bài hát đã phát trong lần phát này)
                } else if(time.type === 'ra_choi') {
                    for (let i = 0; i < songNumber; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                } else if(time.type === 'ra_nghi') {
                    for (let i = 0; i < songNumRegular; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                } else if(time.type === 'song1') {
                    for (let i = 0; i < song1; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                } else if(time.type === 'song2') {
                    for (let i = 0; i < song2; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                } else if(time.type === 'song3') {
                    for (let i = 0; i < song3; i++) {
                        let randomIndex = Math.floor(Math.random() * listMusic.length);
                        if (!currentListMusic.includes(randomIndex)) {
                            currentListMusic.push({index: randomIndex+1, url:`./${dataFolder}/nhac/${listMusic[randomIndex]}`});
                        }
                    }
                }
                markAsCompleted(time.name);
                currentIndexMusic = 0;
                playListMusic();
            }, timeDifference);
        } else {
            markAsCompleted(time.name);
        }
    }

    // Hàm phát nhiều bài nhạc ở audioPlayer theo tuần tự trong listMusicIndex
    function playListMusic(){
        if (currentIndexMusic < currentListMusic.length) {
            audioPlayer.src = currentListMusic[currentIndexMusic].url;
            audioPlayer.play();
            currentIndexMusic++;
        } else {
            currentIndexMusic = 0;
            currentListMusic = [];            
            audioPlayer.src = '';
            audioPlayer.pause();
        }
    }
    // When the current song ends, play the next one
    audioPlayer.addEventListener('ended', playListMusic);

    // Hàm cập nhật UI khi lịch đang hoạt động
    function updateUIForActiveSchedule() {
        disableAllScheduleItems();
        startScheduleElement.disabled = true;
        stopScheduleElement.disabled = false;
        scheduleStatus.innerText = 'Đang hoạt động'; 
        scheduleStatus.classList.remove('bg-warning');
        scheduleStatus.classList.add('bg-success');
        addHourElement.disabled = true;
    }

    // Hàm vô hiệu hóa tất cả các mục lịch
    function disableAllScheduleItems() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        scheduleItems.forEach(disableScheduleItemInputs);
    }

    // Hàm dừng lịch
    function stopSchedule(){
        console.log('Dừng lịch');
        clearAllTimeouts(selectedTemplate);
        updateUIForStoppedSchedule();
        loadSchedule(selectedTemplate);
    }

    // Hàm xóa tất cả các timeout
    function clearAllTimeouts(template) {
        template.listTime.forEach(time => {
            clearTimeout(time.relativeTime);
        });
    }

    // Hàm cập nhật UI khi lịch đã dừng
    function updateUIForStoppedSchedule() {
        startScheduleElement.disabled = false;
        stopScheduleElement.disabled = true;  
        scheduleStatus.innerText = 'Không hoạt động';
        scheduleStatus.classList.remove('bg-success');
        scheduleStatus.classList.add('bg-warning');
        addHourElement.disabled = false;
    }

    // Hàm tải lịch
    function loadSchedule(selectedTemplate){
        scheduleList.innerHTML = '';
        selectedTemplate.listTime.forEach(time => {
            addTime(scheduleList, time);
        });
    }

    // Hàm thêm giờ mới
    function addHour(){
        selectedTemplate.listTime.push({
            name: 'Thời gian mới lúc ' + new Date().toLocaleTimeString(),
            time: '00:00',
            sound: 'sound_in.mp3',
        });
        loadSchedule(selectedTemplate);
        scheduleList.scrollTo(0, scheduleList.scrollHeight);
    }

    // Hàm thêm một mục thời gian vào danh sách
    function addTime(scheduleList, time){
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');
        scheduleItem.innerHTML = `
            <span>${time.name}</span>
            <input type="time" value="${time.time}" onChange="updateTime(this)">
            <select class="form-select" onChange="updateSound(this)">
            ${getSoundOption(time)}
            </select>
            <button class="btn btn-danger removeTime" onClick="removeTime(this)">X</button>
        `;
        scheduleList.appendChild(scheduleItem);
    }

    // Hàm lấy các tùy chọn âm thanh
    function getSoundOption(time){

        return options.map(option => 
            `<option ${time.sound === option.value ? 'selected' : ''} value="${option.value}">${option.text}</option>`
        ).join('');
    }

    // Hàm cập nhật thời gian
    function updateTime(input){
        const name = input.parentElement.querySelector('span').innerText;
        selectedTemplate.listTime.forEach(time => {
            if(time.name === name){
                time.time = input.value;
            }
        });
    }

    // Hàm cập nhật âm thanh
    function updateSound(select){
        const name = select.parentElement.querySelector('span').innerText;
        selectedTemplate.listTime.forEach(time => {
            if(time.name === name){
                time.sound = select.value;
            }
        });
    }

    // Hàm xóa một mục thời gian
    function removeTime(button){
        const name = button.parentElement.querySelector('span').innerText;
        selectedTemplate.listTime = selectedTemplate.listTime.filter(time => {
            if(time.name === name){
                clearTimeout(time.relativeTime);
                return false;
            }
            return true;
        });
        button.parentElement.remove();  
    }

    //Hàm mở khóa màn hình
    const lockScreenBtn = document.getElementById('lockScreen');
    const password = document.getElementById('password');
    const screenLockOverlay = document.getElementById('screenLockOverlay');
    const unlockButton = document.getElementById('unlockButton');
    const error = document.getElementById('error');
    const logout = document.getElementById('logout');

    // Hàm để khóa màn hình
    function lockScreen() {
        screenLockOverlay.style.display = 'flex';
        //enter focus vào input password
        password.focus();
        
    }

    // Hàm để mở khóa màn hình
    function checkPassword() {
        if (password.value === lockScreenPassword) {
            screenLockOverlay.style.display = 'none';            
            error.style.display = 'none';
            password.value = '';
        } else {
            error.style.display = 'block';
        }
    }
    //Gán sự kiện cho nút khóa
    lockScreenBtn.addEventListener('click', lockScreen);
    // Gán sự kiện cho nút mở khóa
    unlockButton.addEventListener('click', checkPassword);
    password.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkPassword();
        }
    });

    logout.addEventListener('click', ()=>{
        window.location.href = './Đăng nhập.html';
        
    });
    // unlockButton.addEventListener('keydown', unlockScreen);

    // Khóa màn hình khi trang tải
    // lockScreen();

    // Gán các hàm vào đối tượng window để có thể gọi từ HTML
    window.removeTime = removeTime;
    window.updateTime = updateTime;
    window.updateSound = updateSound;
    window.addHour = addHour;
    window.startSchedule = startSchedule;
    window.stopSchedule = stopSchedule;
});
