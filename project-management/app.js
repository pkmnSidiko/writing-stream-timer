(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-projects";
  const SELECTED_KEY = "tlc-storyworks-project-selected";
  const $ = id => document.getElementById(id);
  let projects = loadProjects();
  let selectedId = localStorage.getItem(SELECTED_KEY) || null;
  let editingId = null;

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  function now() { return new Date().toISOString(); }
  function blankProject() {
    const stamp = now();
    return { id: uid("project"), name:"", type:"Novel", status:"Idea", description:"", goal:"", deadline:"", currentTask:"",
      milestones:[], links:[], notes:"", createdAt:stamp, updatedAt:stamp };
  }
  function cleanProject(p) {
    const base = blankProject();
    return {
      ...base, ...p,
      id: typeof p?.id === "string" ? p.id : base.id,
      milestones: Array.isArray(p?.milestones) ? p.milestones.filter(m => m && typeof m.title === "string").map(m => ({id:m.id || uid("milestone"), title:m.title, done:Boolean(m.done)})) : [],
      links: Array.isArray(p?.links) ? p.links.filter(l => l && typeof l.url === "string").map(l => ({id:l.id || uid("link"), label:typeof l.label==="string" ? l.label : l.url, url:l.url})) : []
    };
  }
  function loadProjects() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data.map(cleanProject) : [];
    } catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); }
  function announce(message) { $("tracker-status").textContent = message; }
  function selectedProject() { return projects.find(p => p.id === selectedId) || null; }
  function selectProject(id) {
    selectedId = id;
    if (id) localStorage.setItem(SELECTED_KEY, id); else localStorage.removeItem(SELECTED_KEY);
    render();
  }
  function escapeText(value) { return String(value ?? ""); }
  function formatDate(value) {
    if (!value) return "No deadline";
    const d = new Date(value + "T00:00:00");
    return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(d);
  }
  function formatUpdated(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : "Updated " + new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(d);
  }

  function renderList() {
    const list = $("project-list");
    const query = $("project-search").value.trim().toLowerCase();
    list.replaceChildren();
    const matches = projects.filter(p => !query || [p.name,p.type,p.status,p.description].join(" ").toLowerCase().includes(query));
    $("project-list-empty").hidden = matches.length > 0;
    matches.forEach(project => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = project.id === selectedId ? "selected" : "";
      button.setAttribute("role","listitem");
      const title = document.createElement("span");
      title.className = "project-list-title";
      title.textContent = project.name || "Untitled project";
      const meta = document.createElement("span");
      meta.className = "project-list-meta";
      meta.textContent = project.status + (project.deadline ? " · " + formatDate(project.deadline) : "");
      button.append(title,meta);
      button.addEventListener("click",() => selectProject(project.id));
      list.appendChild(button);
    });
  }

  function renderProject() {
    const project = selectedProject();
    $("empty-view").hidden = Boolean(project);
    $("project-view").hidden = !project;
    if (!project) return;

    $("project-type-label").textContent = project.type;
    $("project-heading").textContent = project.name;
    $("project-description").textContent = project.description;
    $("project-description").hidden = !project.description;
    $("project-status").textContent = project.status;
    $("project-goal").textContent = project.goal || "No goal set";
    $("project-deadline").textContent = formatDate(project.deadline);
    const complete = project.milestones.filter(m => m.done).length;
    $("project-milestones").textContent = project.milestones.length ? complete + " of " + project.milestones.length + " complete" : "None yet";
    $("current-task").textContent = project.currentTask || "No current task set. Edit the project when you know what comes next.";
    $("project-notes").textContent = project.notes || "No notes yet.";
    $("project-updated").textContent = formatUpdated(project.updatedAt);

    const milestoneList = $("milestone-list");
    milestoneList.replaceChildren();
    if (!project.milestones.length) {
      const empty = document.createElement("p"); empty.className="empty-state"; empty.textContent="No milestones yet."; milestoneList.appendChild(empty);
    } else {
      project.milestones.forEach(m => {
        const row=document.createElement("div"); row.className="milestone" + (m.done ? " done" : "");
        const check=document.createElement("input"); check.type="checkbox"; check.checked=m.done; check.setAttribute("aria-label","Mark milestone complete: "+m.title);
        check.addEventListener("change",()=>{m.done=check.checked; project.updatedAt=now(); save(); render(); announce(m.done ? "Milestone completed." : "Milestone marked incomplete.");});
        const title=document.createElement("span"); title.textContent=m.title;
        const remove=document.createElement("button"); remove.type="button"; remove.className="icon-button small-icon"; remove.textContent="×"; remove.setAttribute("aria-label","Remove milestone: "+m.title);
        remove.addEventListener("click",()=>{project.milestones=project.milestones.filter(x=>x.id!==m.id); project.updatedAt=now(); save(); render(); announce("Milestone removed.");});
        row.append(check,title,remove); milestoneList.appendChild(row);
      });
    }

    const links=$("project-links"); links.replaceChildren();
    if (!project.links.length) {
      const empty=document.createElement("p"); empty.className="empty-state"; empty.textContent="No links yet."; links.appendChild(empty);
    } else project.links.forEach(l=>{
      const row=document.createElement("div"); row.className="link-item";
      const a=document.createElement("a"); a.href=l.url; a.target="_blank"; a.rel="noopener noreferrer"; a.textContent=l.label || l.url;
      const remove=document.createElement("button"); remove.type="button"; remove.className="icon-button small-icon"; remove.textContent="×"; remove.setAttribute("aria-label","Remove link: "+(l.label || l.url));
      remove.addEventListener("click",()=>{project.links=project.links.filter(x=>x.id!==l.id); project.updatedAt=now(); save(); render(); announce("Link removed.");});
      row.append(a,remove); links.appendChild(row);
    });
  }

  function render() { renderList(); renderProject(); }

  function openEditor(project) {
    editingId = project?.id || null;
    const p = project ? cleanProject(project) : blankProject();
    $("dialog-title").textContent = project ? "Edit project" : "New project";
    $("field-name").value=p.name; $("field-type").value=p.type; $("field-status").value=p.status; $("field-goal").value=p.goal;
    $("field-deadline").value=p.deadline; $("field-task").value=p.currentTask; $("field-description").value=p.description; $("field-notes").value=p.notes;
    renderEditorLists(p);
    $("dialog-error").hidden=true;
    $("project-dialog").showModal();
    requestAnimationFrame(()=>$("field-name").focus());
  }
  function renderEditorLists(p) {
    const milestones=$("form-milestones"); milestones.replaceChildren();
    p.milestones.forEach(m=>addMilestoneEditor(milestones,m));
    const links=$("form-links"); links.replaceChildren();
    p.links.forEach(l=>addLinkEditor(links,l));
  }
  function addMilestoneEditor(container, value={id:uid("milestone"),title:"",done:false}) {
    const row=document.createElement("div"); row.className="editor-row"; row.dataset.id=value.id;
    const input=document.createElement("input"); input.type="text"; input.maxLength=180; input.value=value.title; input.placeholder="Milestone";
    const remove=document.createElement("button"); remove.type="button"; remove.className="icon-button small-icon"; remove.textContent="×"; remove.setAttribute("aria-label","Remove milestone field");
    remove.addEventListener("click",()=>row.remove()); row.append(input,remove); container.appendChild(row);
  }
  function addLinkEditor(container, value={id:uid("link"),label:"",url:""}) {
    const row=document.createElement("div"); row.className="editor-link-row"; row.dataset.id=value.id;
    const label=document.createElement("input"); label.type="text"; label.maxLength=100; label.value=value.label; label.placeholder="Label";
    const url=document.createElement("input"); url.type="url"; url.maxLength=500; url.value=value.url; url.placeholder="https://...";
    const remove=document.createElement("button"); remove.type="button"; remove.className="icon-button small-icon"; remove.textContent="×"; remove.setAttribute("aria-label","Remove link field");
    remove.addEventListener("click",()=>row.remove()); row.append(label,url,remove); container.appendChild(row);
  }
  function readForm() {
    const name=$("field-name").value.trim();
    if (!name) throw new Error("A project name is required.");
    const milestones=[...$("form-milestones").querySelectorAll(".editor-row")].map(row=>({id:row.dataset.id || uid("milestone"),title:row.querySelector("input").value.trim(),done:false})).filter(m=>m.title);
    const links=[...$("form-links").querySelectorAll(".editor-link-row")].map(row=>({id:row.dataset.id || uid("link"),label:row.querySelectorAll("input")[0].value.trim(),url:row.querySelectorAll("input")[1].value.trim()})).filter(l=>l.url);
    links.forEach(l=>{try{new URL(l.url);}catch{throw new Error("Please check the URL for: " + (l.label || l.url));}});
    const existing=editingId ? selectedProject() : null;
    if (existing) {
      const oldById=new Map(existing.milestones.map(m=>[m.id,m]));
      milestones.forEach(m=>{if(oldById.has(m.id))m.done=oldById.get(m.id).done;});
    }
    return {id:existing?.id || uid("project"),name,type:$("field-type").value,status:$("field-status").value,goal:$("field-goal").value.trim(),
      deadline:$("field-deadline").value, currentTask:$("field-task").value.trim(), description:$("field-description").value.trim(),
      milestones,links,notes:$("field-notes").value.trim(),createdAt:existing?.createdAt || now(),updatedAt:now()};
  }
  function closeDialog() { $("project-dialog").close(); editingId=null; }
  function addSimple(type) {
    const project=selectedProject(); if(!project)return;
    const dialog=$("simple-dialog"), label=$("simple-label"), title=$("simple-title");
    title.textContent=type==="milestone" ? "Add milestone" : "Add link";
    label.replaceChildren();
    if(type==="milestone") {
      label.append("Milestone title");
      const input=document.createElement("input"); input.id="simple-value"; input.type="text"; input.maxLength=180; input.required=true; label.appendChild(input);
    } else {
      label.append("Link label");
      const wrap=document.createElement("div"); wrap.className="settings-grid";
      const text=document.createElement("input"); text.id="simple-label-value"; text.type="text"; text.maxLength=100; text.placeholder="Label";
      const url=document.createElement("input"); url.id="simple-value"; url.type="url"; url.maxLength=500; url.placeholder="https://..."; url.required=true;
      wrap.append(text,url); label.appendChild(wrap);
    }
    dialog.dataset.type=type; dialog.showModal(); requestAnimationFrame(()=>$(type==="milestone"?"simple-value":"simple-label-value").focus());
  }

  $("new-project").addEventListener("click",()=>openEditor(null));
  $("empty-new-project").addEventListener("click",()=>openEditor(null));
  $("edit-project").addEventListener("click",()=>{const p=selectedProject();if(p)openEditor(p);});
  $("delete-project").addEventListener("click",()=>{const p=selectedProject();if(!p)return;if(confirm("Delete “"+p.name+"”? This cannot be undone.")){projects=projects.filter(x=>x.id!==p.id);selectedId=projects[0]?.id||null;save();if(selectedId)localStorage.setItem(SELECTED_KEY,selectedId);else localStorage.removeItem(SELECTED_KEY);render();announce("Project deleted.");}});
  $("add-milestone").addEventListener("click",()=>addSimple("milestone"));
  $("add-link").addEventListener("click",()=>addSimple("link"));
  $("form-add-milestone").addEventListener("click",()=>addMilestoneEditor($("form-milestones")));
  $("form-add-link").addEventListener("click",()=>addLinkEditor($("form-links")));
  $("project-search").addEventListener("input",renderList);

  $("project-form").addEventListener("submit",event=>{
    event.preventDefault();
    try {
      const p=readForm();
      const index=projects.findIndex(x=>x.id===p.id);
      if(index>=0) projects[index]=p; else projects.unshift(p);
      selectedId=p.id; localStorage.setItem(SELECTED_KEY,p.id); save(); closeDialog(); render(); announce(index>=0 ? "Project updated." : "Project created.");
    } catch(error) { $("dialog-error").textContent=error.message; $("dialog-error").hidden=false; }
  });
  $("close-dialog").addEventListener("click",closeDialog); $("cancel-dialog").addEventListener("click",closeDialog);
  $("project-dialog").addEventListener("cancel",event=>{event.preventDefault();closeDialog();});
  $("simple-form").addEventListener("submit",event=>{
    event.preventDefault(); const p=selectedProject(); if(!p)return;
    const type=$("simple-dialog").dataset.type;
    if(type==="milestone"){const value=$("simple-value").value.trim();if(!value)return;p.milestones.push({id:uid("milestone"),title:value,done:false});announce("Milestone added.");}
    else {const url=$("simple-value").value.trim();const label=$("simple-label-value").value.trim();try{new URL(url);}catch{$("simple-value").setCustomValidity("Enter a complete URL.");$("simple-value").reportValidity();return;}p.links.push({id:uid("link"),label:label||url,url});announce("Link added.");}
    p.updatedAt=now();save();$("simple-dialog").close();render();
  });
  $("close-simple").addEventListener("click",()=>$("simple-dialog").close());
  $("cancel-simple").addEventListener("click",()=>$("simple-dialog").close());
  $("simple-dialog").addEventListener("cancel",event=>{event.preventDefault();$("simple-dialog").close();});

  $("export-projects").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify({format:"tlc-storyworks-projects",version:1,exportedAt:now(),projects},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="tlc-storyworks-projects.json";a.click();URL.revokeObjectURL(url);announce("Project backup exported.");
  });
  $("import-projects").addEventListener("click",()=>$("import-file").click());
  $("import-file").addEventListener("change",async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try {
      const data=JSON.parse(await file.text());
      if(data?.format!=="tlc-storyworks-projects" || !Array.isArray(data.projects))throw new Error("That file does not look like a TLC Storyworks project backup.");
      const imported=data.projects.map(cleanProject);
      const replace=confirm("Import "+imported.length+" project(s)? Choose OK to replace your current projects, or Cancel to keep them and add the imported projects.");
      if(replace) projects=imported; else {
        const existingIds=new Set(projects.map(p=>p.id));
        imported.forEach(p=>{if(existingIds.has(p.id))p.id=uid("project");projects.push(p);});
      }
      selectedId=projects[0]?.id||null;save();if(selectedId)localStorage.setItem(SELECTED_KEY,selectedId);render();announce("Projects imported.");
    } catch(error) { alert(error.message || "Could not import that file."); }
    event.target.value="";
  });

  render();
})();