(this.webpackJsonptodo=this.webpackJsonptodo||[]).push([[0],{26:function(e,t,n){},28:function(e,t,n){},29:function(e,t,n){},34:function(e,t,n){},35:function(e,t,n){},36:function(e,t,n){"use strict";n.r(t);var a=n(2),c=n(4),s=n.n(c),r=n(20),o=n.n(r),i=(n(26),n(8)),l=n(5),u=n.n(l),d=n(9),b=(n(28),n(15)),j=(n(29),n(12));var p=function(e){var t=e.children,n=e.modalOpen,c=e.okButton,s=e.cancelButton,r=e.onAccept,o=e.onCancel;return Object(a.jsx)(a.Fragment,{children:n?Object(a.jsxs)(a.Fragment,{children:[Object(a.jsxs)("div",{className:"z-depth-5 modal open",children:[Object(a.jsx)("div",{className:"modal-content",children:t}),Object(a.jsxs)("div",{className:"modal-footer",children:[c&&Object(a.jsx)("button",{onClick:r,className:"modal-close waves-effect waves-green btn-flat btn",dangerouslySetInnerHTML:{__html:c}}),s&&Object(a.jsx)("button",{onClick:o,className:"modal-close waves-effect waves-red btn-flat btn left",dangerouslySetInnerHTML:{__html:s}})]})]}),Object(a.jsx)("div",{className:"backdrop",onClick:o})]}):""})};var m=function(e){return{name:e.name||"",checked:e.checked||!1,key:e.key||null,timestamp:e.timestamp||new Date,subtasks:e.subtasks||[],description:e.description||""}},h={loading:"Loading app...",noListName:"New Project "+(new Date).toISOString().slice(0,10),addPh:"Quick-add a task...",addSubtaskPh:"Add subtasks to this task",addSubtaskBtn:"Add a subtask",subtasks:"Subtasks",subtaskStatus:"( Completed / Pending )",deleteTask:"Delete task and its subtasks? Can't be undone",allTasksCompleted:function(){var e=["\ud83d\ude01 All tasks completed!","Now that's what I call a clean list \ud83e\udd73","Wow, such empty \ud83d\udc4f","Finitto? Go for a cappuccino \u2615\ufe0f","All tasks done, time for a break \ud83c\udfd6","So productive. I'm impressed \ud83d\ude0e","Make a Todolist: Done \u2705","I am Finnish \ud83c\uddeb\ud83c\uddee with all tasks."];return e[Math.floor(Math.random()*e.length)]},completed:"Completed",completedNo:"No completed tasks",showCompleted:"Show completed tasks",hideCompleted:"Hide completed tasks",saveTask:"Save",discardTask:"Cancel changes",notes:"Notes",notesPh:"An optional description always helps",projects:"Projects",addProject:"Add a new project",addProjectPh:"Enter a name for a new project",deleteProject:"Delete this project and all the tasks? (cannot be undone)"},f=n(18);f.a.initializeApp({apiKey:"AIzaSyDxmJzv3ccl0_ouKB9oVSzWIsn6uysYMLQ",authDomain:"todo-list-react-33431.firebaseapp.com",databaseURL:"https://todo-list-react-33431.firebaseio.com",projectId:"todo-list-react-33431",storageBucket:"todo-list-react-33431.appspot.com",messagingSenderId:"153291173882",appId:"1:153291173882:web:4eb5673b9a70ce5828fe43",measurementId:"G-BCMCPMQHDB"});var k=f.a.database(),O="nicoemailcom",x={db:k,path:"",updateTask:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("Updating task ",t.name),e.prev=1,e.next=4,k.ref("".concat(x.path,"/tasks/").concat(t.key)).update(t);case 4:return e.abrupt("return",e.sent);case 7:e.prev=7,e.t0=e.catch(1),console.error("Error on update: ",e.t0);case 10:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(t){return e.apply(this,arguments)}}(),addTask:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("Adding task ",t.name),e.prev=1,e.next=4,k.ref("".concat(x.path,"/tasks")).push(t);case 4:return e.abrupt("return",e.sent);case 7:e.prev=7,e.t0=e.catch(1),console.error("Error on save task: ",e.t0);case 10:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(t){return e.apply(this,arguments)}}(),deleteTask:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("Deleting task ",t.name),e.prev=1,e.next=4,k.ref("".concat(x.path,"/tasks/").concat(t.key)).remove((function(){console.info('"'.concat(t.name,'" was removed!'))}));case 4:e.next=9;break;case 6:e.prev=6,e.t0=e.catch(1),console.error("Error on delete task: ",e.t0);case 9:case"end":return e.stop()}}),e,null,[[1,6]])})));return function(t){return e.apply(this,arguments)}}(),getProject:function(e,t){x.path="lists/".concat(O,"/").concat(e);try{return k.ref(x.path).on("value",(function(e){var n=e.child("name").val(),a={key:e.key,name:n,tasks:[]};e.child("tasks").forEach((function(e){a.tasks.push(Object(b.a)({key:e.key,subtasks:[]},e.val()))})),t(a)}))}catch(n){console.error("Error on fetching tasks: ",n)}},getProjects:function(e){try{return k.ref("lists/".concat(O)).on("value",(function(t){var n=[];t.forEach((function(e){var t=e.val(),a=Object.values(t.tasks||""),c=a.filter((function(e){return e.checked})).length,s=a.length-c;n.push({key:e.key,name:t.name,openTasks:s,completedTasks:c})})),e(n),console.info("Lists loaded: ",n.length)}))}catch(t){console.error("Error on fetching tasks: ",t)}},saveListName:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("Updating list name ",t),e.prev=1,e.next=4,k.ref("".concat(x.path)).update({name:t});case 4:return e.abrupt("return",e.sent);case 7:e.prev=7,e.t0=e.catch(1),console.error("Error on save name: ",e.t0);case 10:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(t){return e.apply(this,arguments)}}(),newProject:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,k.ref("lists/".concat(O)).push({name:t});case 3:return e.abrupt("return",e.sent);case 6:e.prev=6,e.t0=e.catch(0),console.error("Error on create project: ",e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}(),deleteProject:function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,console.info("Deleting project ",t.name),e.next=4,k.ref("lists/".concat(O,"/").concat(t.key)).remove();case 4:return e.abrupt("return",e.sent);case 7:e.prev=7,e.t0=e.catch(0),console.error("Error on delete project: ",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(t){return e.apply(this,arguments)}}()},v=x;var g=function(e){var t=e.trigger,n=e.task,s=e.modalOpen,r=e.setModalOpen,o=Object(c.useState)(""),l=Object(i.a)(o,2),b=l[0],f=l[1],k=Object(c.useState)(n.subtasks||[]),O=Object(i.a)(k,2),x=O[0],g=O[1],N=Object(c.useState)([]),y=Object(i.a)(N,2),w=y[0],C=y[1],S=Object(c.useState)(n.name||""),P=Object(i.a)(S,2),L=P[0],E=P[1],D=Object(c.useState)(n.description||""),M=Object(i.a)(D,2),I=M[0],B=M[1],F=Object(c.useContext)(T).name;function A(e,t){return _.apply(this,arguments)}function _(){return(_=Object(d.a)(u.a.mark((function e(t,n){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.key){e.next=5;break}return e.next=3,v.updateTask(t);case 3:e.next=6;break;case 5:v.addTask(m(t)).then((function(e){t.key=e.key}));case 6:r(!!n);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function z(e){return K.apply(this,arguments)}function K(){return(K=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n.name=L,n.description=I,n.subtasks=[].concat(Object(j.a)(x),Object(j.a)(w)),e.next=6,A(n,!1);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function H(){return(H=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z(t);case 2:r(!1);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(c.useEffect)((function(){E(n.name||""),g(n.subtasks||[]),B(n.description||"")}),[n]),Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)("button",{className:t.className,onClick:function(){return r(!0)},children:t.text}),Object(a.jsxs)(p,{modalOpen:s,onAccept:function(e){return H.apply(this,arguments)},onCancel:function(){return r(!1)},okButton:h.saveTask+' <i class="material-icons right">save</i>',cancelButton:h.discardTask+' <i class="material-icons right">cancel</i>',children:[Object(a.jsx)("h6",{className:"subtle mb-15 mt-5",children:F}),Object(a.jsxs)("form",{onSubmit:z,children:[Object(a.jsxs)("div",{children:[Object(a.jsx)("label",{children:"Task Name"}),Object(a.jsx)("input",{value:L,placeholder:"Enter a name for the task",onChange:function(e){return E(e.target.value)}})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("label",{children:h.notes}),Object(a.jsx)("textarea",{value:I,className:"materialize-textarea",placeholder:h.notesPh,onChange:function(e){return B(e.target.value)}})]})]}),Object(a.jsxs)("ul",{className:"list-unstyled flex-column",children:[(x||[]).map((function(e){return Object(a.jsxs)("li",{title:e.timestamp,className:"block",children:[Object(a.jsxs)("label",{className:"left",children:[Object(a.jsx)("input",{type:"checkbox",checked:e.checked,id:e.key,className:"material-cb",onChange:function(){return(t=e).checked=!t.checked,void g(Object(j.a)(null===n||void 0===n?void 0:n.subtasks));var t}}),Object(a.jsx)("div",{})]}),Object(a.jsx)("span",{className:"left",children:e.name})]},e.key)})),w.map((function(e){return Object(a.jsxs)("li",{className:"block",children:[Object(a.jsxs)("label",{className:"left",children:[Object(a.jsx)("input",{type:"checkbox",className:"material-cb",disabled:!0}),Object(a.jsx)("div",{})]}),Object(a.jsx)("span",{className:"left subtle",children:e.name})]},e.key)})),Object(a.jsx)("li",{children:Object(a.jsxs)("form",{onSubmit:function(e){e.preventDefault(),C([].concat(Object(j.a)(w),[{key:Math.random(),timestamp:new Date,name:b,checked:!1}])),e.target[0].value=""},children:[Object(a.jsx)("label",{children:h.subtasks}),Object(a.jsx)("input",{onChange:function(e){return f(e.target.value)},placeholder:h.addSubtaskPh,className:"input-field"})]})},"new-subtask")]})]})]})};var N=function(e){var t=e.extraClass,n=e.task,s=e.saveSubtasks,r=Object(c.useState)(""),o=Object(i.a)(r,2),l=o[0],u=o[1],d=Object(c.useState)(!1),b=Object(i.a)(d,2),p=b[0],m=b[1];return Object(a.jsxs)("ul",{className:"list-unstyled flex-column "+t,children:[(n.subtasks||[]).map((function(e){return Object(a.jsxs)("li",{title:e.timestamp,className:"block",children:[Object(a.jsxs)("label",{className:"left",children:[Object(a.jsx)("input",{type:"checkbox",checked:e.checked,id:e.key,className:"material-cb",onChange:function(){return(t=e).checked=!t.checked,void s(n);var t}}),Object(a.jsx)("div",{})]}),Object(a.jsx)("span",{className:"left",children:e.name})]},e.key)})),Object(a.jsx)("li",{children:p?Object(a.jsx)("form",{onSubmit:function(e){e.preventDefault(),e.target[0].value="",m(!1),n.subtasks=[].concat(Object(j.a)(n.subtasks||[]),[{key:Math.random(),timestamp:new Date,name:l,checked:!1}]),s(n)},children:Object(a.jsx)("input",{onChange:function(e){return u(e.target.value)},placeholder:h.addSubtaskPh,autoFocus:!0,className:"input-field invisible"})}):Object(a.jsxs)("button",{className:"btn-flat subtle",onClick:function(){return m(!0)},children:[Object(a.jsx)("i",{className:"material-icons left",children:"add"}),h.addSubtaskBtn]})},"new-subtask")]})};var y=function(e){var t=e.task,n=Object(c.useState)(t.subtasks||[]),s=Object(i.a)(n,2),r=s[0],o=s[1],l=Object(c.useState)(!1),j=Object(i.a)(l,2),p=j[0],m=j[1],f=Object(c.useState)(!1),k=Object(i.a)(f,2),O=k[0],x=k[1],y=r.filter((function(e){return!!e.checked})).length;function w(){return(w=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.checked=!t.checked,t.checked&&((t.subtasks||[]).forEach((function(e){return e.checked=!0})),t.expanded=!1),e.next=4,v.updateTask(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function C(){return(C=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:x(t);case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function S(){return(S=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o(t.subtasks),e.next=3,v.updateTask(t);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(){return(P=Object(d.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm(h.deleteTask)){e.next=3;break}return e.next=3,v.deleteTask(t);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(a.jsxs)("li",{className:(t.checked?"done":"")+" parent-hover task",title:t.timestamp,children:[Object(a.jsxs)("div",{className:"task-content",children:[Object(a.jsx)("button",{className:"toggle-expand subtle btn-invisible material-icons tiny left "+(O&&" expanded"),onClick:function(){return function(e){return C.apply(this,arguments)}(!O)},children:"chevron_right"}),Object(a.jsxs)("label",{className:"left",children:[Object(a.jsx)("input",{type:"checkbox",className:"material-cb",checked:t.checked,onChange:function(){return function(e){return w.apply(this,arguments)}(t)}}),Object(a.jsx)("div",{})]}),Object(a.jsxs)("button",{className:"btn-invisible task-name "+(t.checked,""),onClick:function(){return m(!0)},children:[t.name,Object(a.jsxs)("span",{className:"subtle child-hover ml-5",title:h.subtaskStatus,children:["(",y," / ",r.length-y,")"]})]}),Object(a.jsxs)("span",{className:"right",children:[Object(a.jsx)("button",{className:"child-hover btn-subtle ml-5 material-icons right",onClick:function(){return function(){return P.apply(this,arguments)}(t)},children:"delete"}),Object(a.jsx)(g,{trigger:{className:"child-hover btn-subtle ml-5 material-icons right",text:"edit"},task:Object(b.a)({},t),modalOpen:p,setModalOpen:m})]})]}),O&&Object(a.jsxs)(a.Fragment,{children:[t.description&&Object(a.jsx)("div",{className:"ml-50",children:Object(a.jsxs)("p",{children:[Object(a.jsxs)("span",{className:"subtle",children:[h.notes,":"]})," ",t.description]})}),Object(a.jsx)(N,{extraClass:"ml-50",saveSubtasks:function(e){return S.apply(this,arguments)},subtasks:r,task:t})]})]})};var w=function(e){var t=e.project,n=e.showCompleted,c=e.setShowCompleted;return t.editListName?Object(a.jsx)("form",{onSubmit:t.saveListName,children:Object(a.jsx)("input",{className:"as-title m0 invisible h4",autoFocus:!0,value:t.listName||h.noListName,onChange:function(e){return t.setListName(e.target.value)}})}):Object(a.jsxs)("div",{className:"flex-row",children:[Object(a.jsx)("h4",{className:"max-content m0",onClick:function(){return t.setEditListName(!0)},children:t.listName||h.noListName}),n?Object(a.jsx)("button",{className:"material-icons ml-5 toggle-completed btn-invisible subtle",onClick:function(){return c(!1)},title:h.hideCompleted,children:"check_box"}):Object(a.jsx)("button",{className:"material-icons ml-5 toggle-completed btn-invisible subtle",onClick:function(){return c(!0)},title:h.showCompleted,children:"check_box_outline_blank"})]})};var C=function(e){var t=e.project,n=Object(c.useState)(!0),s=Object(i.a)(n,2),r=s[0],o=s[1],l=Object(c.useState)(!1),b=Object(i.a)(l,2),j=b[0],p=b[1],f=Object(c.useState)(t.name),k=Object(i.a)(f,2),O=k[0],x=k[1],N=Object(c.useState)(!1),C=Object(i.a)(N,2),S=C[0],P=C[1],T=(t.tasks||[]).filter((function(e){return!e.checked})),L=(t.tasks||[]).filter((function(e){return!!e.checked})),E=Object(c.useMemo)((function(){return h.allTasksCompleted()}),[T.length]),D="";function M(){return(M=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),t.target[0].value="",e.next=4,v.addTask(m({name:D}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function I(){return(I=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,v.saveListName(O);case 3:P(!1);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return function(e){var t=e.submit,n=e.changed,c=e.completed,s=e.open,r=e.showCompleted,o=e.setShowCompleted,i=e.modalOpen,l=e.setModalOpen,u=e.allCompleted,d=e.project;return Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(w,{project:d,showCompleted:r,setShowCompleted:o}),Object(a.jsxs)("ul",{className:"list-unstyled",children:[s.length?s.map((function(e){return Object(a.jsx)(y,{task:e},e.key)})):c.length?Object(a.jsx)("li",{children:Object(a.jsx)("h5",{className:"subtle max-content",children:u})}):"",r&&c.map((function(e){return Object(a.jsx)(y,{task:e},e.key)}))]}),Object(a.jsx)("form",{className:"form-inline",onSubmit:t,children:Object(a.jsx)("div",{className:"form-group",children:Object(a.jsx)("div",{className:"input-group mb-2",children:Object(a.jsx)("input",{onChange:n,className:"invisible",placeholder:h.addPh,required:!0,autoComplete:"off"})})})}),Object(a.jsx)(g,{trigger:{className:"btn-floating btn-large fixed-action-btn subtle-bg",text:Object(a.jsx)("i",{className:"material-icons",children:"add"})},task:{},modalOpen:i,setModalOpen:l})]})}({open:T,completed:L,submit:function(e){return M.apply(this,arguments)},changed:function(e){D=e.target.value},showCompleted:r,setShowCompleted:o,modalOpen:j,allCompleted:E,setModalOpen:p,project:{listName:O,saveListName:function(e){return I.apply(this,arguments)},editListName:S,setEditListName:P,setListName:x}})};n(34);var S=function(){return Object(a.jsx)("span",{className:"app-loader",children:Object(a.jsx)("span",{children:h.loading})})};n(35);var P=function(e){var t=e.projectKey,n=e.setProjectKey,s=e.setShowLoader,r=Object(c.useState)([]),o=Object(i.a)(r,2),l=o[0],b=o[1],j=Object(c.useState)(!1),p=Object(i.a)(j,2),m=p[0],f=p[1],k=Object(c.useState)(""),O=Object(i.a)(k,2),x=O[0],g=O[1];function N(){return(N=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm(h.deleteProject)){e.next=5;break}return s(!0),n(""),e.next=5,v.deleteProject(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(c.useEffect)((function(){v.getProjects((function(e){b(e),!t&&e.length&&n(e[0].key)}))}),[]),Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)("h4",{children:h.projects}),Object(a.jsxs)("ul",{className:"projects-list flex-column",children:[l.map((function(e){return Object(a.jsxs)("li",{className:(t===e.key?"selected":"")+" mb-5 parent-hover ",children:[Object(a.jsxs)("button",{className:"btn-invisible left",onClick:function(){var a;(a=e).key!==t&&n(a.key)},children:[e.name," ( ",e.openTasks," ",Object(a.jsxs)("span",{className:"subtle",children:["/ ",e.completedTasks]})," )"]}),Object(a.jsx)("button",{className:"btn-invisible child-hover left",onClick:function(){return function(e){return N.apply(this,arguments)}(e)},children:Object(a.jsx)("i",{className:"tiny material-icons subtle",children:"delete"})})]},e.key)})),Object(a.jsx)("li",{children:m?Object(a.jsx)("form",{onSubmit:function(e){e.preventDefault(),v.newProject(x).then((function(e){f(!1),g("")}))},children:Object(a.jsx)("input",{className:"invisible subtle",onChange:function(e){return g(e.target.value)},required:!0,minLength:"3",value:x,autoFocus:!0,placeholder:h.addProjectPh,onBlur:function(){return f(!1)}})}):Object(a.jsxs)("button",{className:"btn-invisible btn-flat subtle",onClick:function(){return f(!0)},children:[Object(a.jsx)("i",{className:"material-icons left tiny",children:"add"}),h.addProject]})})]})]})},T=s.a.createContext({});var L=function(){var e=Object(c.useState)(window.location.hash.substring(1)),t=Object(i.a)(e,2),n=t[0],s=t[1],r=Object(c.useState)({}),o=Object(i.a)(r,2),l=o[0],u=o[1],d=Object(c.useState)(!0),b=Object(i.a)(d,2),j=b[0],p=b[1];return Object(c.useEffect)((function(){return window.location.hash=n,v.getProject(n,(function(e){u(e),p(!1)})),function(){v.db.ref(v.path).off("value")}}),[n]),Object(a.jsxs)(a.Fragment,{children:[j&&Object(a.jsx)(S,{}),Object(a.jsxs)("div",{className:"row m0",children:[Object(a.jsx)("div",{className:"col s3 projects-list-box",children:Object(a.jsx)(P,{projectKey:n,setProjectKey:s,setShowLoader:p})}),Object(a.jsx)("div",{className:"col s9 tasks-list-box flex-column",children:Object(a.jsx)(T.Provider,{value:{key:l.key,name:l.name},children:Object(a.jsx)(C,{project:l})})})]})]})};o.a.render(Object(a.jsx)(L,{}),document.getElementById("root"))}},[[36,1,2]]]);
//# sourceMappingURL=main.183f3501.chunk.js.map