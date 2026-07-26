document.addEventListener('DOMContentLoaded', function() {
    // 1. จัดการการส่งฟอร์ม (หน้า submit.html)
    const form = document.getElementById('projectForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newProject = {
                id: Date.now(),
                name: document.getElementById('pName').value,
                type: document.getElementById('pType').value,
                url: document.getElementById('pUrl').value,
                desc: document.getElementById('pDesc').value,
                status: 'pending' // สถานะรอตรวจ
            };

            let projects = JSON.parse(localStorage.getItem('neon_projects')) || [];
            projects.push(newProject);
            localStorage.setItem('neon_projects', JSON.stringify(projects));

            alert('ส่งผลงานสำเร็จ! ระบบได้ส่งข้อมูลเข้าคิวรอแอดมินตรวจสอบแล้ว');
            form.reset();
        });
    }

    // 2. แสดงผลงานที่อนุมัติแล้ว (หน้า index.html)
    const publicContainer = document.getElementById('publicProjects');
    if (publicContainer) {
        let projects = JSON.parse(localStorage.getItem('neon_projects')) || [];
        let approved = projects.filter(p => p.status === 'approved');

        if (approved.length > 0) {
            publicContainer.innerHTML = '';
            approved.forEach(p => {
                publicContainer.innerHTML += `
                    <div style="border: 1px solid #00f0ff; padding: 15px; margin-top: 10px; border-radius: 8px; background: rgba(0,240,255,0.05);">
                        <h3 style="color: #00f0ff; margin: 0 0 5px 0;">${p.name} <span style="font-size: 12px; color: #ff007f;">[${p.type}]</span></h3>
                        <p style="margin: 5px 0; color: #ddd;">${p.desc}</p>
                        <a href="${p.url}" target="_blank" style="color: #00f0ff; font-weight: bold; text-decoration: none;">🔗 เข้าชมผลงาน (ผ่านการตรวจสอบแล้ว)</a>
                    </div>
                `;
            });
        } else {
            publicContainer.innerHTML = '<p style="color: #aaa;">ยังไม่มีผลงานที่ผ่านการตรวจสอบในระบบ</p>';
        }
    }

    // 3. จัดการคิวแอดมิน (หน้า admin.html)
    const adminQueue = document.getElementById('adminQueue');
    if (adminQueue) {
        loadAdminQueue();
    }
});

function loadAdminQueue() {
    let projects = JSON.parse(localStorage.getItem('neon_projects')) || [];
    let pending = projects.filter(p => p.status === 'pending');
    let adminQueue = document.getElementById('adminQueue');

    if (pending.length > 0) {
        adminQueue.innerHTML = '';
        pending.forEach(p => {
            adminQueue.innerHTML += `
                <div style="border: 1px solid #ff007f; padding: 15px; margin-top: 10px; border-radius: 8px; background: rgba(255,0,127,0.05);">
                    <h4 style="color: #ff007f; margin: 0 0 5px 0;">${p.name} (${p.type})</h4>
                    <p style="margin: 5px 0;">ลิงก์ส่งตรวจ: <a href="${p.url}" target="_blank" style="color: #00f0ff;">${p.url}</a></p>
                    <p style="margin: 5px 0; color: #ccc;">รายละเอียด: ${p.desc}</p>
                    <br>
                    <button onclick="approveProject(${p.id})" style="background:#00f0ff; color:#000; border:none; padding:8px 15px; font-weight:bold; border-radius:4px; cursor:pointer; margin-right:10px;">✅ อนุมัติความปลอดภัย</button>
                    <button onclick="deleteProject(${p.id})" style="background:#ff3333; color:#fff; border:none; padding:8px 15px; font-weight:bold; border-radius:4px; cursor:pointer;">❌ ปฏิเสธ/ลบ</button>
                </div>
            `;
        });
    } else {
        adminQueue.innerHTML = '<p style="color: #aaa;">ไม่มีรายการค้างตรวจสอบ</p>';
    }
}

function approveProject(id) {
    let projects = JSON.parse(localStorage.getItem('neon_projects'));
    projects = projects.map(p => {
        if (p.id === id) p.status = 'approved';
        return p;
    });
    localStorage.setItem('neon_projects', JSON.stringify(projects));
    alert('อนุมัติผลงานสำเร็จ! เผยแพร่ขึ้นหน้าแรกเรียบร้อย');
    loadAdminQueue();
}

function deleteProject(id) {
    let projects = JSON.parse(localStorage.getItem('neon_projects'));
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('neon_projects', JSON.stringify(projects));
    alert('ลบรายการออกเรียบร้อย');
    loadAdminQueue();
}
