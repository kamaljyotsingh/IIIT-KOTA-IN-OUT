import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import Chart from 'chart.js/auto'; // For Chart.js v3+

// Helper for dynamic Tailwind classes
const statCardColors = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-500' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-500' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-500' },
};

const progressBarColors = {
    Students: 'bg-blue-600',
    Faculty: 'bg-indigo-600',
    Staff: 'bg-purple-600',
};


function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('logs');
    const [stats, setStats] = useState({
        students: 247, faculty: 32, staff: 18,
        studentChange: 12, facultyChange: 5, staffChange: -3
    });
    const [logs, setLogs] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: '', timeRange: 'all', category: 'all', search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1, limit: 10, total: 0
    });

    const sampleLogs = useMemo(() => [
    { id: "2023kucp1067", name: "Ishaan Patel", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-14" },
    { id: "2022kuec1192", name: "Aditya Gupta", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-14" },
    { id: "2022kucp1019", name: "Aditya Verma", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-14" },
    { id: "2023kuec1116", name: "Vihaan Singh", category: "Student", status: "OUT", time: "08:00 PM", date: "2025-05-14" },
    { id: "2024kucp1109", name: "Atharv Gupta", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-14" },
    { id: "2023kucp1186", name: "Vihaan Reddy", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-14" },
    { id: "2022kucp1056", name: "Vivaan Reddy", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-14" },
    { id: "2023kuec1003", name: "Aditya Jain", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-14" },
    { id: "2023kucp1065", name: "Aditya Gupta", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-14" },
    { id: "2022kuec1104", name: "Vihaan Kumar", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-14" },
    { id: "2023kuec1047", name: "Ishaan Verma", category: "Student", status: "IN", time: "07:15 PM", date: "2025-05-14" },
    { id: "2022kucp1099", name: "Aditya Gupta", category: "Student", status: "OUT", time: "06:45 PM", date: "2025-05-14" },
    { id: "2024kucp1028", name: "Aarav Patel", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-14" },
    { id: "2022kucp1158", name: "Aditya Patel", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-14" },
    { id: "2022kucp1104", name: "Shaurya Jain", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-14" },
    { id: "2024kucp1192", name: "Arjun Kumar", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-14" },
    { id: "2022kuec1164", name: "Vihaan Singh", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-14" },
    { id: "STF032", name: "Suman Gupta", category: "Staff", status: "IN", time: "06:30 PM", date: "2025-05-14" },
    { id: "2022kuec1179", name: "Ishaan Mishra", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-14" },
    { id: "2024kuec1061", name: "Arjun Kumar", category: "Student", status: "IN", time: "06:00 PM", date: "2025-05-14" },
    { id: "2024kucp1159", name: "Sai Mishra", category: "Student", status: "OUT", time: "05:45 PM", date: "2025-05-14" },
    { id: "2022kuec1181", name: "Vihaan Sharma", category: "Student", status: "IN", time: "05:45 PM", date: "2025-05-14" },
    { id: "STF034", name: "Harish Kumar", category: "Staff", status: "IN", time: "05:45 PM", date: "2025-05-14" },
    { id: "STF043", name: "Kumar Verma", category: "Staff", status: "IN", time: "05:30 PM", date: "2025-05-14" },
    { id: "2022kucp1154", name: "Vihaan Singh", category: "Student", status: "IN", time: "05:15 PM", date: "2025-05-14" },
    { id: "2022kucp1097", name: "Sai Verma", category: "Student", status: "OUT", time: "05:15 PM", date: "2025-05-14" },
    { id: "2022kucp1041", name: "Vivaan Singh", category: "Student", status: "OUT", time: "05:15 PM", date: "2025-05-14" },
    { id: "2024kucp1046", name: "Arjun Singh", category: "Student", status: "OUT", time: "05:00 PM", date: "2025-05-14" },
    { id: "STF033", name: "Rekha Reddy", category: "Staff", status: "IN", time: "05:00 PM", date: "2025-05-14" },
    { id: "2024kuec1127", name: "Vivaan Patel", category: "Student", status: "OUT", time: "04:45 PM", date: "2025-05-14" },
    { id: "2022kuec1131", name: "Sai Patel", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-14" },
    { id: "2023kucp1146", name: "Shaurya Verma", category: "Student", status: "IN", time: "04:15 PM", date: "2025-05-14" },
    { id: "2022kuec1052", name: "Ishaan Verma", category: "Student", status: "IN", time: "04:00 PM", date: "2025-05-14" },
    { id: "2024kuec1121", name: "Aarav Mehra", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-14" },
    { id: "2024kucp1120", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "03:45 PM", date: "2025-05-14" },
    { id: "2022kucp1013", name: "Sai Kumar", category: "Student", status: "IN", time: "03:30 PM", date: "2025-05-14" },
    { id: "2022kucp1187", name: "Shaurya Jain", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-14" },
    { id: "2023kucp1131", name: "Sai Gupta", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-14" },
    { id: "2023kuec1098", name: "Ishaan Singh", category: "Student", status: "OUT", time: "03:00 PM", date: "2025-05-14" },
    { id: "2024kuec1070", name: "Shaurya Mishra", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-14" },
    { id: "2022kuec1114", name: "Vihaan Mehra", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-14" },
    { id: "2022kucp1130", name: "Sai Gupta", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-14" },
    { id: "2022kuec1135", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-14" },
    { id: "FAC016", name: "Prof. Kavita Verma", category: "Faculty", status: "OUT", time: "02:30 PM", date: "2025-05-14" },
    { id: "2024kuec1144", name: "Aditya Mishra", category: "Student", status: "IN", time: "02:15 PM", date: "2025-05-14" },
    { id: "2022kuec1184", name: "Atharv Jain", category: "Student", status: "IN", time: "02:00 PM", date: "2025-05-14" },
    { id: "STF003", name: "Pooja Verma", category: "Staff", status: "OUT", time: "02:00 PM", date: "2025-05-14" },
    { id: "STF014", name: "Pooja Sharma", category: "Staff", status: "OUT", time: "02:00 PM", date: "2025-05-14" },
    { id: "2022kucp1161", name: "Krishna Mehra", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-14" },
    { id: "2022kucp1138", name: "Sai Sharma", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-14" },
    { id: "2024kucp1121", name: "Sai Gupta", category: "Student", status: "IN", time: "01:15 PM", date: "2025-05-14" },
    { id: "2024kuec1122", name: "Vivaan Patel", category: "Student", status: "IN", time: "01:15 PM", date: "2025-05-14" },
    { id: "2024kuec1091", name: "Arjun Gupta", category: "Student", status: "OUT", time: "01:00 PM", date: "2025-05-14" },
    { id: "2024kuec1139", name: "Krishna Verma", category: "Student", status: "OUT", time: "01:00 PM", date: "2025-05-14" },
    { id: "2024kucp1113", name: "Krishna Mishra", category: "Student", status: "OUT", time: "12:45 PM", date: "2025-05-14" },
    { id: "2022kucp1109", name: "Atharv Verma", category: "Student", status: "OUT", time: "12:30 PM", date: "2025-05-14" },
    { id: "2024kucp1109", name: "Vihaan Mishra", category: "Student", status: "OUT", time: "12:15 PM", date: "2025-05-14" },
    { id: "2024kuec1061", name: "Vivaan Singh", category: "Student", status: "IN", time: "12:15 PM", date: "2025-05-14" },
    { id: "2023kucp1029", name: "Aditya Jain", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-14" },
    { id: "2024kuec1084", name: "Atharv Jain", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-14" },
    { id: "2023kucp1054", name: "Ishaan Sharma", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-14" },
    { id: "2023kuec1073", name: "Ishaan Reddy", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-14" },
    { id: "2023kuec1078", name: "Aditya Mishra", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-14" },
    { id: "2023kucp1011", name: "Vivaan Mishra", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-14" },
    { id: "2022kucp1151", name: "Aditya Sharma", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-14" },
    { id: "2023kuec1118", name: "Krishna Singh", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-14" },
    { id: "2023kuec1073", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "11:15 AM", date: "2025-05-14" },
    { id: "2023kucp1058", name: "Ishaan Kumar", category: "Student", status: "OUT", time: "11:15 AM", date: "2025-05-14" },
    { id: "2023kuec1190", name: "Arjun Verma", category: "Student", status: "OUT", time: "10:45 AM", date: "2025-05-14" },
    { id: "2024kuec1061", name: "Shaurya Kumar", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-14" },
    { id: "2024kuec1128", name: "Vihaan Singh", category: "Student", status: "IN", time: "10:15 AM", date: "2025-05-14" },
    { id: "FAC008", name: "Dr. Rajeev Mehra", category: "Faculty", status: "IN", time: "10:15 AM", date: "2025-05-14" },
    { id: "2022kuec1015", name: "Arjun Mehra", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-14" },
    { id: "2023kuec1059", name: "Vihaan Mishra", category: "Student", status: "OUT", time: "10:00 AM", date: "2025-05-14" },
    { id: "2022kucp1098", name: "Sai Patel", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-14" },
    { id: "2022kuec1142", name: "Shaurya Kumar", category: "Student", status: "OUT", time: "10:00 AM", date: "2025-05-14" },
    { id: "FAC002", name: "Prof. Sunita Singh", category: "Faculty", status: "IN", time: "09:45 AM", date: "2025-05-14" },
    { id: "2022kuec1125", name: "Aarav Singh", category: "Student", status: "OUT", time: "09:30 AM", date: "2025-05-14" },
    { id: "2024kucp1191", name: "Shaurya Jain", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-14" },
    { id: "2023kuec1087", name: "Arjun Mishra", category: "Student", status: "IN", time: "09:15 AM", date: "2025-05-14" },
    { id: "STF036", name: "Rajesh Mehra", category: "Staff", status: "OUT", time: "09:15 AM", date: "2025-05-14" },
    { id: "2024kuec1070", name: "Krishna Reddy", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-14" },
    { id: "2023kuec1028", name: "Ishaan Reddy", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-14" },
    { id: "2024kucp1075", name: "Aditya Singh", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-14" },
    { id: "2024kucp1172", name: "Aditya Sharma", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-14" },
    { id: "2023kucp1039", name: "Atharv Patel", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-14" },
    { id: "2024kuec1159", name: "Aditya Reddy", category: "Student", status: "OUT", time: "08:30 AM", date: "2025-05-14" },
    { id: "2023kucp1177", name: "Atharv Sharma", category: "Student", status: "IN", time: "08:30 AM", date: "2025-05-14" },
    { id: "STF020", name: "Suman Gupta", category: "Staff", status: "IN", time: "08:30 AM", date: "2025-05-14" },
    { id: "2024kucp1017", name: "Shaurya Singh", category: "Student", status: "IN", time: "08:15 AM", date: "2025-05-14" },
    { id: "2022kuec1191", name: "Vivaan Singh", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-14" },
    { id: "2023kuec1167", name: "Krishna Singh", category: "Student", status: "OUT", time: "08:00 AM", date: "2025-05-14" },
    { id: "2023kucp1016", name: "Aarav Sharma", category: "Student", status: "OUT", time: "08:00 AM", date: "2025-05-14" },
    { id: "2023kucp1166", name: "Atharv Mishra", category: "Student", status: "OUT", time: "08:45 PM", date: "2025-05-13" },
    { id: "2022kucp1151", name: "Sai Jain", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-13" },
    { id: "2024kucp1197", name: "Atharv Mishra", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-13" },
    { id: "2022kuec1111", name: "Sai Patel", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-13" },
    { id: "2024kuec1105", name: "Vihaan Patel", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-13" },
    { id: "2023kuec1100", name: "Aarav Patel", category: "Student", status: "OUT", time: "08:15 PM", date: "2025-05-13" },
    { id: "2024kucp1143", name: "Krishna Jain", category: "Student", status: "OUT", time: "08:15 PM", date: "2025-05-13" },
    { id: "2023kuec1167", name: "Vihaan Verma", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-13" },
    { id: "2022kucp1029", name: "Arjun Reddy", category: "Student", status: "OUT", time: "08:00 PM", date: "2025-05-13" },
    { id: "2023kuec1159", name: "Vihaan Sharma", category: "Student", status: "OUT", time: "08:00 PM", date: "2025-05-13" },
    { id: "2023kucp1074", name: "Krishna Singh", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-13" },
    { id: "2023kucp1172", name: "Vivaan Kumar", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-13" },
    { id: "2023kuec1114", name: "Arjun Reddy", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-13" },
    { id: "2024kuec1197", name: "Aarav Mishra", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-13" },
    { id: "2023kuec1042", name: "Aarav Kumar", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-13" },
    { id: "2022kuec1016", name: "Vihaan Mishra", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-13" },
    { id: "2022kucp1040", name: "Krishna Kumar", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-13" },
    { id: "2024kuec1133", name: "Aarav Singh", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-13" },
    { id: "2024kuec1164", name: "Vihaan Jain", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-13" },
    { id: "2022kuec1194", name: "Ishaan Verma", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-13" },
    { id: "2024kucp1045", name: "Krishna Singh", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-13" },
    { id: "2023kuec1017", name: "Vihaan Jain", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-13" },
    { id: "STF047", name: "Kumar Patel", category: "Staff", status: "OUT", time: "06:30 PM", date: "2025-05-13" },
    { id: "2022kucp1176", name: "Krishna Patel", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-13" },
    { id: "2022kuec1171", name: "Vihaan Gupta", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-13" },
    { id: "2024kucp1150", name: "Shaurya Mishra", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-13" },
    { id: "2022kuec1113", name: "Atharv Singh", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-13" },
    { id: "2023kuec1197", name: "Vihaan Mehra", category: "Student", status: "IN", time: "06:00 PM", date: "2025-05-13" },
    { id: "2023kuec1158", name: "Arjun Reddy", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-13" },
    { id: "STF026", name: "Rekha Sharma", category: "Staff", status: "OUT", time: "06:00 PM", date: "2025-05-13" },
    { id: "2022kuec1160", name: "Ishaan Mishra", category: "Student", status: "OUT", time: "05:45 PM", date: "2025-05-13" },
    { id: "2023kucp1087", name: "Vihaan Kumar", category: "Student", status: "IN", time: "05:30 PM", date: "2025-05-13" },
    { id: "2023kucp1104", name: "Atharv Patel", category: "Student", status: "OUT", time: "05:30 PM", date: "2025-05-13" },
    { id: "FAC005", name: "Prof. Sunita Jain", category: "Faculty", status: "OUT", time: "05:30 PM", date: "2025-05-13" },
    { id: "STF028", name: "Naveen Reddy", category: "Staff", status: "OUT", time: "05:30 PM", date: "2025-05-13" },
    { id: "2024kuec1182", name: "Shaurya Mishra", category: "Student", status: "OUT", time: "05:15 PM", date: "2025-05-13" },
    { id: "2024kucp1024", name: "Aditya Reddy", category: "Student", status: "OUT", time: "05:00 PM", date: "2025-05-13" },
    { id: "2023kucp1017", name: "Aarav Singh", category: "Student", status: "IN", time: "04:30 PM", date: "2025-05-13" },
    { id: "2024kucp1194", name: "Aditya Patel", category: "Student", status: "OUT", time: "04:30 PM", date: "2025-05-13" },
    { id: "2023kuec1066", name: "Shaurya Patel", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-13" },
    { id: "2024kuec1133", name: "Krishna Patel", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-13" },
    { id: "2022kuec1181", name: "Vihaan Mehra", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-13" },
    { id: "2023kucp1040", name: "Sai Verma", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-13" },
    { id: "2024kucp1151", name: "Sai Verma", category: "Student", status: "IN", time: "03:30 PM", date: "2025-05-13" },
    { id: "2022kuec1137", name: "Vihaan Verma", category: "Student", status: "OUT", time: "03:30 PM", date: "2025-05-13" },
    { id: "STF010", name: "Kumar Jain", category: "Staff", status: "IN", time: "03:30 PM", date: "2025-05-13" },
    { id: "2023kucp1068", name: "Vihaan Mehra", category: "Student", status: "IN", time: "03:15 PM", date: "2025-05-13" },
    { id: "2024kucp1004", name: "Ishaan Jain", category: "Student", status: "IN", time: "03:15 PM", date: "2025-05-13" },
    { id: "STF006", name: "Harish Verma", category: "Staff", status: "IN", time: "03:15 PM", date: "2025-05-13" },
    { id: "2023kuec1066", name: "Krishna Gupta", category: "Student", status: "OUT", time: "03:00 PM", date: "2025-05-13" },
    { id: "2022kuec1172", name: "Arjun Gupta", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-13" },
    { id: "2022kuec1085", name: "Shaurya Kumar", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-13" },
    { id: "STF050", name: "Suman Sharma", category: "Staff", status: "IN", time: "02:30 PM", date: "2025-05-13" },
    { id: "2022kuec1117", name: "Vivaan Singh", category: "Student", status: "OUT", time: "02:15 PM", date: "2025-05-13" },
    { id: "2022kuec1102", name: "Ishaan Patel", category: "Student", status: "IN", time: "02:15 PM", date: "2025-05-13" },
    { id: "2024kucp1185", name: "Ishaan Jain", category: "Student", status: "IN", time: "02:00 PM", date: "2025-05-13" },
    { id: "2022kuec1052", name: "Arjun Mishra", category: "Student", status: "OUT", time: "02:00 PM", date: "2025-05-13" },
    { id: "STF022", name: "Meena Sharma", category: "Staff", status: "OUT", time: "01:45 PM", date: "2025-05-13" },
    { id: "2023kuec1024", name: "Arjun Sharma", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-13" },
    { id: "2023kucp1040", name: "Arjun Patel", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-13" },
    { id: "2024kucp1054", name: "Vivaan Mishra", category: "Student", status: "OUT", time: "01:15 PM", date: "2025-05-13" },
    { id: "2022kuec1051", name: "Sai Jain", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-13" },
    { id: "2024kucp1062", name: "Aditya Verma", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-13" },
    { id: "2024kucp1024", name: "Vihaan Singh", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-13" },
    { id: "2024kucp1185", name: "Krishna Mehra", category: "Student", status: "OUT", time: "01:00 PM", date: "2025-05-13" },
    { id: "2024kucp1044", name: "Ishaan Mishra", category: "Student", status: "OUT", time: "01:00 PM", date: "2025-05-13" },
    { id: "2023kuec1036", name: "Vihaan Mehra", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-13" },
    { id: "2023kuec1060", name: "Aditya Gupta", category: "Student", status: "IN", time: "12:45 PM", date: "2025-05-13" },
    { id: "2022kucp1061", name: "Krishna Jain", category: "Student", status: "IN", time: "12:45 PM", date: "2025-05-13" },
    { id: "2024kuec1135", name: "Aarav Patel", category: "Student", status: "OUT", time: "12:45 PM", date: "2025-05-13" },
    { id: "2024kucp1091", name: "Atharv Sharma", category: "Student", status: "OUT", time: "12:45 PM", date: "2025-05-13" },
    { id: "STF004", name: "Kumar Verma", category: "Staff", status: "IN", time: "12:45 PM", date: "2025-05-13" },
    { id: "2024kucp1118", name: "Vihaan Mishra", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-13" },
    { id: "2022kuec1036", name: "Aditya Mehra", category: "Student", status: "IN", time: "12:15 PM", date: "2025-05-13" },
    { id: "STF039", name: "Kumar Kumar", category: "Staff", status: "OUT", time: "12:15 PM", date: "2025-05-13" },
    { id: "2022kucp1051", name: "Ishaan Kumar", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-13" },
    { id: "2024kucp1034", name: "Shaurya Jain", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-13" },
    { id: "STF027", name: "Jyoti Verma", category: "Staff", status: "OUT", time: "12:00 PM", date: "2025-05-13" },
    { id: "2024kucp1160", name: "Sai Mehra", category: "Student", status: "OUT", time: "11:45 AM", date: "2025-05-13" },
    { id: "2022kuec1063", name: "Vivaan Gupta", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-13" },
    { id: "2023kucp1141", name: "Krishna Mehra", category: "Student", status: "IN", time: "11:15 AM", date: "2025-05-13" },
    { id: "STF007", name: "Pooja Kumar", category: "Staff", status: "IN", time: "11:15 AM", date: "2025-05-13" },
    { id: "2023kuec1170", name: "Atharv Singh", category: "Student", status: "OUT", time: "11:00 AM", date: "2025-05-13" },
    { id: "STF045", name: "Rekha Gupta", category: "Staff", status: "OUT", time: "11:00 AM", date: "2025-05-13" },
    { id: "2022kucp1192", name: "Vivaan Patel", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-13" },
    { id: "2022kuec1051", name: "Aditya Patel", category: "Student", status: "OUT", time: "10:45 AM", date: "2025-05-13" },
    { id: "2022kucp1134", name: "Arjun Gupta", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-13" },
    { id: "2023kucp1066", name: "Arjun Verma", category: "Student", status: "OUT", time: "10:15 AM", date: "2025-05-13" },
    { id: "2024kucp1073", name: "Sai Kumar", category: "Student", status: "OUT", time: "10:15 AM", date: "2025-05-13" },
    { id: "2024kuec1026", name: "Aarav Mehra", category: "Student", status: "OUT", time: "10:15 AM", date: "2025-05-13" },
    { id: "2024kuec1051", name: "Shaurya Jain", category: "Student", status: "IN", time: "10:15 AM", date: "2025-05-13" },
    { id: "2024kuec1123", name: "Arjun Reddy", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-13" },
    { id: "2022kuec1052", name: "Arjun Mehra", category: "Student", status: "OUT", time: "09:45 AM", date: "2025-05-13" },
    { id: "2023kuec1003", name: "Krishna Mishra", category: "Student", status: "IN", time: "09:45 AM", date: "2025-05-13" },
    { id: "2022kuec1141", name: "Vihaan Kumar", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-13" },
    { id: "2022kuec1102", name: "Vivaan Kumar", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-13" },
    { id: "2023kucp1103", name: "Aarav Verma", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-13" },
    { id: "2022kucp1093", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-13" },
    { id: "2023kuec1007", name: "Shaurya Mehra", category: "Student", status: "IN", time: "09:15 AM", date: "2025-05-13" },
    { id: "2023kuec1038", name: "Shaurya Reddy", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-13" },
    { id: "2023kuec1156", name: "Atharv Mehra", category: "Student", status: "IN", time: "09:00 AM", date: "2025-05-13" },
    { id: "2023kucp1010", name: "Aarav Singh", category: "Student", status: "OUT", time: "09:00 AM", date: "2025-05-13" },
    { id: "FAC006", name: "Prof. Priya Patel", category: "Faculty", status: "OUT", time: "09:00 AM", date: "2025-05-13" },
    { id: "2024kucp1007", name: "Atharv Reddy", category: "Student", status: "OUT", time: "08:45 AM", date: "2025-05-13" },
    { id: "2024kuec1047", name: "Vihaan Sharma", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-13" },
    { id: "2022kucp1139", name: "Ishaan Mehra", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-13" },
    { id: "2024kuec1064", name: "Arjun Mehra", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-13" },
    { id: "2024kuec1104", name: "Krishna Verma", category: "Student", status: "IN", time: "08:00 AM", date: "2025-05-13" },
    { id: "2023kucp1200", name: "Vihaan Singh", category: "Student", status: "OUT", time: "08:45 PM", date: "2025-05-12" },
    { id: "2024kucp1125", name: "Ishaan Gupta", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-12" },
    { id: "2022kucp1046", name: "Vivaan Sharma", category: "Student", status: "OUT", time: "08:45 PM", date: "2025-05-12" },
    { id: "2024kucp1169", name: "Ishaan Singh", category: "Student", status: "OUT", time: "08:45 PM", date: "2025-05-12" },
    { id: "2022kucp1074", name: "Aarav Verma", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-12" },
    { id: "2024kuec1112", name: "Aarav Verma", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-12" },
    { id: "2023kucp1182", name: "Aarav Patel", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-12" },
    { id: "2022kuec1048", name: "Vivaan Singh", category: "Student", status: "IN", time: "08:00 PM", date: "2025-05-12" },
    { id: "2024kucp1027", name: "Atharv Singh", category: "Student", status: "IN", time: "08:00 PM", date: "2025-05-12" },
    { id: "2023kucp1130", name: "Krishna Reddy", category: "Student", status: "IN", time: "08:00 PM", date: "2025-05-12" },
    { id: "2022kucp1058", name: "Sai Gupta", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-12" },
    { id: "2023kucp1171", name: "Krishna Mehra", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-12" },
    { id: "2023kucp1010", name: "Krishna Mehra", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-12" },
    { id: "2024kucp1102", name: "Atharv Singh", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-12" },
    { id: "2022kuec1016", name: "Aditya Sharma", category: "Student", status: "OUT", time: "07:45 PM", date: "2025-05-12" },
    { id: "2024kucp1173", name: "Atharv Singh", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-12" },
    { id: "2023kucp1136", name: "Atharv Verma", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-12" },
    { id: "2024kucp1134", name: "Sai Jain", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-12" },
    { id: "2022kuec1078", name: "Ishaan Kumar", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-12" },
    { id: "2023kuec1108", name: "Sai Mehra", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-12" },
    { id: "2023kucp1099", name: "Atharv Sharma", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-12" },
    { id: "2022kucp1007", name: "Aarav Reddy", category: "Student", status: "OUT", time: "07:00 PM", date: "2025-05-12" },
    { id: "2024kucp1127", name: "Ishaan Kumar", category: "Student", status: "OUT", time: "06:45 PM", date: "2025-05-12" },
    { id: "2024kuec1166", name: "Vivaan Singh", category: "Student", status: "OUT", time: "06:45 PM", date: "2025-05-12" },
    { id: "2024kucp1077", name: "Aditya Mishra", category: "Student", status: "OUT", time: "06:45 PM", date: "2025-05-12" },
    { id: "FAC001", name: "Dr. Swati Gupta", category: "Faculty", status: "IN", time: "06:45 PM", date: "2025-05-12" },
    { id: "2022kuec1047", name: "Vihaan Verma", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-12" },
    { id: "2024kucp1074", name: "Atharv Kumar", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-12" },
    { id: "2024kuec1061", name: "Vihaan Verma", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-12" },
    { id: "2024kucp1150", name: "Shaurya Jain", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-12" },
    { id: "2023kuec1119", name: "Aarav Patel", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-12" },
    { id: "2022kuec1170", name: "Arjun Patel", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-12" },
    { id: "2024kucp1043", name: "Krishna Jain", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-12" },
    { id: "STF015", name: "Meena Gupta", category: "Staff", status: "OUT", time: "06:15 PM", date: "2025-05-12" },
    { id: "2024kucp1108", name: "Vivaan Patel", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-12" },
    { id: "STF024", name: "Anil Gupta", category: "Staff", status: "IN", time: "06:00 PM", date: "2025-05-12" },
    { id: "2022kucp1193", name: "Arjun Gupta", category: "Student", status: "OUT", time: "05:30 PM", date: "2025-05-12" },
    { id: "2024kuec1027", name: "Atharv Kumar", category: "Student", status: "IN", time: "05:30 PM", date: "2025-05-12" },
    { id: "2023kucp1020", name: "Krishna Mehra", category: "Student", status: "OUT", time: "05:30 PM", date: "2025-05-12" },
    { id: "FAC019", name: "Dr. Amit Mehra", category: "Faculty", status: "IN", time: "05:30 PM", date: "2025-05-12" },
    { id: "STF019", name: "Meena Verma", category: "Staff", status: "OUT", time: "05:30 PM", date: "2025-05-12" },
    { id: "2024kucp1080", name: "Shaurya Mehra", category: "Student", status: "IN", time: "05:15 PM", date: "2025-05-12" },
    { id: "2022kuec1016", name: "Ishaan Mehra", category: "Student", status: "IN", time: "05:15 PM", date: "2025-05-12" },
    { id: "2024kuec1110", name: "Arjun Sharma", category: "Student", status: "OUT", time: "05:15 PM", date: "2025-05-12" },
    { id: "2022kuec1129", name: "Vivaan Gupta", category: "Student", status: "OUT", time: "04:45 PM", date: "2025-05-12" },
    { id: "2022kuec1079", name: "Ishaan Jain", category: "Student", status: "IN", time: "04:30 PM", date: "2025-05-12" },
    { id: "2022kucp1088", name: "Arjun Reddy", category: "Student", status: "IN", time: "04:15 PM", date: "2025-05-12" },
    { id: "2022kuec1126", name: "Arjun Gupta", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-12" },
    { id: "2023kucp1118", name: "Aarav Verma", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-12" },
    { id: "2022kuec1141", name: "Aditya Patel", category: "Student", status: "IN", time: "04:00 PM", date: "2025-05-12" },
    { id: "2024kuec1154", name: "Vivaan Gupta", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-12" },
    { id: "2024kucp1100", name: "Vivaan Verma", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-12" },
    { id: "2022kuec1184", name: "Atharv Verma", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-12" },
    { id: "2022kucp1194", name: "Shaurya Singh", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-12" },
    { id: "2023kuec1112", name: "Arjun Reddy", category: "Student", status: "OUT", time: "03:30 PM", date: "2025-05-12" },
    { id: "2023kuec1118", name: "Vivaan Verma", category: "Student", status: "IN", time: "03:15 PM", date: "2025-05-12" },
    { id: "2023kuec1166", name: "Shaurya Reddy", category: "Student", status: "OUT", time: "03:15 PM", date: "2025-05-12" },
    { id: "STF009", name: "Meena Reddy", category: "Staff", status: "IN", time: "03:15 PM", date: "2025-05-12" },
    { id: "STF046", name: "Anil Gupta", category: "Staff", status: "IN", time: "03:15 PM", date: "2025-05-12" },
    { id: "2022kucp1103", name: "Vihaan Kumar", category: "Student", status: "OUT", time: "03:00 PM", date: "2025-05-12" },
    { id: "2024kucp1050", name: "Krishna Reddy", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-12" },
    { id: "FAC004", name: "Dr. Sunita Sharma", category: "Faculty", status: "OUT", time: "03:00 PM", date: "2025-05-12" },
    { id: "2022kucp1198", name: "Arjun Mehra", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-12" },
    { id: "2022kucp1155", name: "Aditya Singh", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-12" },
    { id: "STF012", name: "Rekha Singh", category: "Staff", status: "IN", time: "02:45 PM", date: "2025-05-12" },
    { id: "2024kuec1131", name: "Aarav Mishra", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-12" },
    { id: "2022kucp1127", name: "Aditya Jain", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-12" },
    { id: "2022kuec1018", name: "Vivaan Kumar", category: "Student", status: "OUT", time: "02:15 PM", date: "2025-05-12" },
    { id: "2022kuec1078", name: "Shaurya Mehra", category: "Student", status: "IN", time: "02:15 PM", date: "2025-05-12" },
    { id: "2022kucp1146", name: "Atharv Verma", category: "Student", status: "OUT", time: "02:15 PM", date: "2025-05-12" },
    { id: "2024kucp1102", name: "Arjun Kumar", category: "Student", status: "IN", time: "02:00 PM", date: "2025-05-12" },
    { id: "2024kucp1036", name: "Aditya Gupta", category: "Student", status: "OUT", time: "02:00 PM", date: "2025-05-12" },
    { id: "FAC020", name: "Dr. Ravi Patel", category: "Faculty", status: "IN", time: "02:00 PM", date: "2025-05-12" },
    { id: "2022kucp1007", name: "Krishna Jain", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-12" },
    { id: "2024kucp1096", name: "Arjun Singh", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-12" },
    { id: "2022kuec1075", name: "Ishaan Gupta", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-12" },
    { id: "2022kucp1036", name: "Shaurya Gupta", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-12" },
    { id: "2023kucp1059", name: "Krishna Mishra", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-12" },
    { id: "2022kucp1106", name: "Vivaan Patel", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-12" },
    { id: "2024kuec1161", name: "Vihaan Patel", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-12" },
    { id: "2024kucp1116", name: "Krishna Patel", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-12" },
    { id: "2023kucp1154", name: "Shaurya Mishra", category: "Student", status: "IN", time: "01:15 PM", date: "2025-05-12" },
    { id: "FAC012", name: "Dr. Swati Sharma", category: "Faculty", status: "IN", time: "01:15 PM", date: "2025-05-12" },
    { id: "2022kucp1047", name: "Aditya Sharma", category: "Student", status: "OUT", time: "01:00 PM", date: "2025-05-12" },
    { id: "2023kuec1189", name: "Vihaan Sharma", category: "Student", status: "IN", time: "12:45 PM", date: "2025-05-12" },
    { id: "2024kuec1003", name: "Shaurya Mishra", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-12" },
    { id: "2023kuec1103", name: "Krishna Mishra", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-12" },
    { id: "2023kuec1001", name: "Ishaan Singh", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-12" },
    { id: "2023kucp1065", name: "Sai Reddy", category: "Student", status: "OUT", time: "12:30 PM", date: "2025-05-12" },
    { id: "2023kucp1005", name: "Sai Mishra", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-12" },
    { id: "2024kucp1152", name: "Vihaan Patel", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-12" },
    { id: "2023kuec1129", name: "Ishaan Patel", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-12" },
    { id: "2024kuec1083", name: "Krishna Mishra", category: "Student", status: "OUT", time: "11:45 AM", date: "2025-05-12" },
    { id: "2022kucp1002", name: "Vivaan Gupta", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-12" },
    { id: "2022kuec1148", name: "Aditya Sharma", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-12" },
    { id: "2022kucp1115", name: "Aditya Patel", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-12" },
    { id: "2023kuec1043", name: "Atharv Mehra", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-12" },
    { id: "2024kuec1113", name: "Krishna Verma", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-12" },
    { id: "2022kuec1019", name: "Sai Verma", category: "Student", status: "OUT", time: "11:15 AM", date: "2025-05-12" },
    { id: "2023kucp1007", name: "Krishna Verma", category: "Student", status: "OUT", time: "11:15 AM", date: "2025-05-12" },
    { id: "2023kuec1177", name: "Sai Sharma", category: "Student", status: "IN", time: "11:15 AM", date: "2025-05-12" },
    { id: "FAC017", name: "Prof. Rajeev Reddy", category: "Faculty", status: "OUT", time: "11:00 AM", date: "2025-05-12" },
    { id: "2024kucp1101", name: "Ishaan Jain", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "2023kuec1186", name: "Vivaan Kumar", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "2023kucp1163", name: "Shaurya Sharma", category: "Student", status: "OUT", time: "10:45 AM", date: "2025-05-12" },
    { id: "2024kucp1170", name: "Vivaan Sharma", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "2024kuec1032", name: "Krishna Gupta", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "2023kuec1188", name: "Sai Reddy", category: "Student", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "STF023", name: "Rekha Sharma", category: "Staff", status: "IN", time: "10:45 AM", date: "2025-05-12" },
    { id: "2024kucp1147", name: "Sai Patel", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-12" },
    { id: "2022kuec1151", name: "Aarav Singh", category: "Student", status: "IN", time: "10:30 AM", date: "2025-05-12" },
    { id: "2024kucp1201", name: "Vihaan Mehra", category: "Student", status: "IN", time: "10:30 AM", date: "2025-05-12" },
    { id: "2022kucp1159", name: "Atharv Patel", category: "Student", status: "OUT", time: "10:15 AM", date: "2025-05-12" },
    { id: "2024kuec1023", name: "Sai Sharma", category: "Student", status: "OUT", time: "10:00 AM", date: "2025-05-12" },
    { id: "2023kucp1033", name: "Sai Mishra", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-12" },
    { id: "2023kucp1135", name: "Aarav Patel", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-12" },
    { id: "2022kuec1063", name: "Shaurya Mehra", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-12" },
    { id: "2022kucp1178", name: "Krishna Singh", category: "Student", status: "OUT", time: "10:00 AM", date: "2025-05-12" },
    { id: "STF049", name: "Pooja Sharma", category: "Staff", status: "IN", time: "09:45 AM", date: "2025-05-12" },
    { id: "2024kucp1015", name: "Vivaan Singh", category: "Student", status: "OUT", time: "09:30 AM", date: "2025-05-12" },
    { id: "2024kucp1010", name: "Aditya Verma", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-12" },
    { id: "2022kuec1105", name: "Vihaan Mehra", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-12" },
    { id: "2022kucp1169", name: "Ishaan Singh", category: "Student", status: "OUT", time: "09:30 AM", date: "2025-05-12" },
    { id: "FAC018", name: "Prof. Priya Patel", category: "Faculty", status: "OUT", time: "09:30 AM", date: "2025-05-12" },
    { id: "2023kuec1173", name: "Atharv Mishra", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-12" },
    { id: "2022kucp1031", name: "Aarav Reddy", category: "Student", status: "IN", time: "09:15 AM", date: "2025-05-12" },
    { id: "2024kuec1149", name: "Vivaan Jain", category: "Student", status: "OUT", time: "09:00 AM", date: "2025-05-12" },
    { id: "STF041", name: "Kumar Jain", category: "Staff", status: "OUT", time: "09:00 AM", date: "2025-05-12" },
    { id: "2022kuec1082", name: "Arjun Mehra", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-12" },
    { id: "2024kucp1051", name: "Ishaan Reddy", category: "Student", status: "OUT", time: "08:30 AM", date: "2025-05-12" },
    { id: "2022kuec1120", name: "Arjun Jain", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-12" },
    { id: "2023kuec1007", name: "Krishna Kumar", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-12" },
    { id: "2022kucp1180", name: "Vivaan Mehra", category: "Student", status: "IN", time: "08:00 AM", date: "2025-05-12" },
    { id: "2023kuec1010", name: "Aditya Singh", category: "Student", status: "IN", time: "08:00 AM", date: "2025-05-12" },
    { id: "2023kucp1013", name: "Sai Verma", category: "Student", status: "IN", time: "08:00 AM", date: "2025-05-12" },
    { id: "2023kucp1004", name: "Ishaan Patel", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-11" },
    { id: "2023kucp1200", name: "Aarav Gupta", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-11" },
    { id: "2022kucp1175", name: "Krishna Verma", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-11" },
    { id: "2023kuec1040", name: "Aditya Patel", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2022kuec1030", name: "Krishna Patel", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2024kucp1116", name: "Vivaan Mehra", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2024kuec1005", name: "Shaurya Patel", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2023kucp1035", name: "Arjun Mishra", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2024kuec1109", name: "Shaurya Jain", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "2022kucp1002", name: "Atharv Sharma", category: "Student", status: "IN", time: "08:30 PM", date: "2025-05-11" },
    { id: "FAC011", name: "Prof. Kavita Jain", category: "Faculty", status: "OUT", time: "08:30 PM", date: "2025-05-11" },
    { id: "STF030", name: "Suman Sharma", category: "Staff", status: "OUT", time: "08:30 PM", date: "2025-05-11" },
    { id: "2023kucp1201", name: "Vihaan Verma", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-11" },
    { id: "2023kucp1192", name: "Vihaan Gupta", category: "Student", status: "OUT", time: "08:15 PM", date: "2025-05-11" },
    { id: "STF025", name: "Pooja Patel", category: "Staff", status: "IN", time: "08:15 PM", date: "2025-05-11" },
    { id: "2022kuec1054", name: "Krishna Verma", category: "Student", status: "OUT", time: "08:00 PM", date: "2025-05-11" },
    { id: "2023kuec1002", name: "Sai Gupta", category: "Student", status: "IN", time: "08:00 PM", date: "2025-05-11" },
    { id: "2023kucp1088", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "07:15 PM", date: "2025-05-11" },
    { id: "2022kuec1163", name: "Aarav Kumar", category: "Student", status: "OUT", time: "07:15 PM", date: "2025-05-11" },
    { id: "2023kuec1144", name: "Arjun Sharma", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-11" },
    { id: "2024kucp1168", name: "Shaurya Singh", category: "Student", status: "OUT", time: "07:00 PM", date: "2025-05-11" },
    { id: "2024kuec1085", name: "Aditya Gupta", category: "Student", status: "IN", time: "06:45 PM", date: "2025-05-11" },
    { id: "2023kuec1065", name: "Vihaan Sharma", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-11" },
    { id: "2023kuec1148", name: "Aarav Gupta", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-11" },
    { id: "2022kuec1040", name: "Krishna Mishra", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-11" },
    { id: "2022kuec1101", name: "Krishna Verma", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-11" },
    { id: "2024kuec1097", name: "Shaurya Patel", category: "Student", status: "IN", time: "06:00 PM", date: "2025-05-11" },
    { id: "2022kuec1171", name: "Ishaan Sharma", category: "Student", status: "OUT", time: "05:15 PM", date: "2025-05-11" },
    { id: "2023kucp1170", name: "Shaurya Mehra", category: "Student", status: "OUT", time: "05:00 PM", date: "2025-05-11" },
    { id: "2024kuec1195", name: "Aditya Verma", category: "Student", status: "OUT", time: "04:45 PM", date: "2025-05-11" },
    { id: "2022kucp1115", name: "Sai Reddy", category: "Student", status: "IN", time: "04:45 PM", date: "2025-05-11" },
    { id: "2022kuec1076", name: "Vihaan Kumar", category: "Student", status: "IN", time: "04:30 PM", date: "2025-05-11" },
    { id: "2024kuec1182", name: "Atharv Verma", category: "Student", status: "OUT", time: "04:30 PM", date: "2025-05-11" },
    { id: "2022kuec1003", name: "Shaurya Reddy", category: "Student", status: "OUT", time: "04:30 PM", date: "2025-05-11" },
    { id: "2023kuec1031", name: "Aarav Sharma", category: "Student", status: "IN", time: "04:15 PM", date: "2025-05-11" },
    { id: "2024kucp1046", name: "Aditya Sharma", category: "Student", status: "IN", time: "04:15 PM", date: "2025-05-11" },
    { id: "2024kucp1026", name: "Krishna Gupta", category: "Student", status: "OUT", time: "03:45 PM", date: "2025-05-11" },
    { id: "2024kucp1080", name: "Vihaan Mishra", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-11" },
    { id: "2024kuec1168", name: "Arjun Patel", category: "Student", status: "OUT", time: "03:45 PM", date: "2025-05-11" },
    { id: "2024kuec1131", name: "Aarav Verma", category: "Student", status: "OUT", time: "03:30 PM", date: "2025-05-11" },
    { id: "2023kucp1026", name: "Krishna Kumar", category: "Student", status: "OUT", time: "03:30 PM", date: "2025-05-11" },
    { id: "2024kucp1114", name: "Atharv Mishra", category: "Student", status: "OUT", time: "03:15 PM", date: "2025-05-11" },
    { id: "2024kuec1094", name: "Vihaan Gupta", category: "Student", status: "OUT", time: "03:00 PM", date: "2025-05-11" },
    { id: "2023kucp1043", name: "Atharv Mehra", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-11" },
    { id: "2022kucp1011", name: "Aditya Mehra", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-11" },
    { id: "2023kuec1188", name: "Ishaan Patel", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-11" },
    { id: "2023kucp1179", name: "Ishaan Mehra", category: "Student", status: "IN", time: "03:00 PM", date: "2025-05-11" },
    { id: "2022kuec1004", name: "Sai Jain", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-11" },
    { id: "STF035", name: "Meena Mishra", category: "Staff", status: "IN", time: "02:45 PM", date: "2025-05-11" },
    { id: "2022kucp1042", name: "Sai Mishra", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-11" },
    { id: "2023kuec1047", name: "Shaurya Reddy", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-11" },
    { id: "2024kuec1054", name: "Atharv Singh", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-11" },
    { id: "2022kuec1082", name: "Aditya Singh", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-11" },
    { id: "2024kucp1024", name: "Sai Patel", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-11" },
    { id: "STF017", name: "Kumar Sharma", category: "Staff", status: "OUT", time: "02:30 PM", date: "2025-05-11" },
    { id: "2024kuec1147", name: "Shaurya Gupta", category: "Student", status: "OUT", time: "02:15 PM", date: "2025-05-11" },
    { id: "2022kuec1121", name: "Ishaan Reddy", category: "Student", status: "OUT", time: "02:15 PM", date: "2025-05-11" },
    { id: "2022kuec1184", name: "Aditya Verma", category: "Student", status: "OUT", time: "02:00 PM", date: "2025-05-11" },
    { id: "2022kuec1032", name: "Krishna Reddy", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-11" },
    { id: "2023kucp1126", name: "Ishaan Gupta", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-11" },
    { id: "2023kuec1043", name: "Vivaan Mishra", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-11" },
    { id: "2023kuec1189", name: "Aditya Reddy", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-11" },
    { id: "2022kuec1060", name: "Sai Gupta", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-11" },
    { id: "2022kuec1076", name: "Shaurya Mehra", category: "Student", status: "IN", time: "01:30 PM", date: "2025-05-11" },
    { id: "2022kuec1017", name: "Krishna Kumar", category: "Student", status: "IN", time: "01:30 PM", date: "2025-05-11" },
    { id: "2023kuec1017", name: "Vihaan Verma", category: "Student", status: "IN", time: "01:30 PM", date: "2025-05-11" },
    { id: "2023kucp1191", name: "Vivaan Mehra", category: "Student", status: "IN", time: "01:30 PM", date: "2025-05-11" },
    { id: "STF044", name: "Pooja Verma", category: "Staff", status: "OUT", time: "01:15 PM", date: "2025-05-11" },
    { id: "2023kucp1122", name: "Arjun Mishra", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-11" },
    { id: "2023kuec1051", name: "Arjun Mehra", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-11" },
    { id: "2023kuec1060", name: "Atharv Mehra", category: "Student", status: "OUT", time: "12:45 PM", date: "2025-05-11" },
    { id: "2024kucp1031", name: "Ishaan Sharma", category: "Student", status: "OUT", time: "12:30 PM", date: "2025-05-11" },
    { id: "2022kucp1154", name: "Sai Gupta", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-11" },
    { id: "STF040", name: "Kumar Kumar", category: "Staff", status: "OUT", time: "12:30 PM", date: "2025-05-11" },
    { id: "2024kucp1123", name: "Aditya Gupta", category: "Student", status: "OUT", time: "12:15 PM", date: "2025-05-11" },
    { id: "STF031", name: "Meena Mishra", category: "Staff", status: "OUT", time: "12:15 PM", date: "2025-05-11" },
    { id: "2022kucp1012", name: "Atharv Mishra", category: "Student", status: "IN", time: "12:00 PM", date: "2025-05-11" },
    { id: "2023kucp1142", name: "Vivaan Gupta", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-11" },
    { id: "2024kuec1115", name: "Arjun Reddy", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-11" },
    { id: "2024kuec1179", name: "Vivaan Mishra", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-11" },
    { id: "2022kucp1047", name: "Atharv Sharma", category: "Student", status: "IN", time: "11:30 AM", date: "2025-05-11" },
    { id: "2024kucp1030", name: "Krishna Mishra", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-11" },
    { id: "2022kuec1178", name: "Shaurya Patel", category: "Student", status: "OUT", time: "10:45 AM", date: "2025-05-11" },
    { id: "2022kucp1079", name: "Aarav Reddy", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-11" },
    { id: "2023kuec1034", name: "Shaurya Singh", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-11" },
    { id: "2022kuec1183", name: "Aditya Verma", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-11" },
    { id: "2024kuec1168", name: "Vihaan Jain", category: "Student", status: "IN", time: "10:15 AM", date: "2025-05-11" },
    { id: "2024kuec1126", name: "Aditya Kumar", category: "Student", status: "IN", time: "10:15 AM", date: "2025-05-11" },
    { id: "STF002", name: "Rajesh Gupta", category: "Staff", status: "OUT", time: "10:15 AM", date: "2025-05-11" },
    { id: "2023kuec1085", name: "Aarav Reddy", category: "Student", status: "IN", time: "10:00 AM", date: "2025-05-11" },
    { id: "2023kuec1141", name: "Aditya Mishra", category: "Student", status: "OUT", time: "09:45 AM", date: "2025-05-11" },
    { id: "STF048", name: "Jyoti Sharma", category: "Staff", status: "OUT", time: "09:45 AM", date: "2025-05-11" },
    { id: "2023kuec1036", name: "Aditya Sharma", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-11" },
    { id: "2022kuec1114", name: "Ishaan Sharma", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-11" },
    { id: "2023kucp1188", name: "Arjun Reddy", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-11" },
    { id: "2024kuec1176", name: "Aarav Mehra", category: "Student", status: "IN", time: "09:15 AM", date: "2025-05-11" },
    { id: "2024kucp1186", name: "Sai Gupta", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-11" },
    { id: "2022kuec1189", name: "Vivaan Reddy", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-11" },
    { id: "2022kucp1022", name: "Arjun Gupta", category: "Student", status: "OUT", time: "09:00 AM", date: "2025-05-11" },
    { id: "2022kuec1196", name: "Sai Kumar", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-11" },
    { id: "2024kucp1137", name: "Vihaan Reddy", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-11" },
    { id: "2022kuec1064", name: "Aditya Sharma", category: "Student", status: "OUT", time: "08:45 AM", date: "2025-05-11" },
    { id: "2023kucp1032", name: "Vivaan Gupta", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-11" },
    { id: "2022kucp1075", name: "Arjun Kumar", category: "Student", status: "IN", time: "08:30 AM", date: "2025-05-11" },
    { id: "2023kucp1074", name: "Arjun Kumar", category: "Student", status: "OUT", time: "08:30 AM", date: "2025-05-11" },
    { id: "2023kucp1174", name: "Vivaan Jain", category: "Student", status: "IN", time: "08:15 AM", date: "2025-05-11" },
    { id: "2023kucp1168", name: "Arjun Verma", category: "Student", status: "OUT", time: "08:15 AM", date: "2025-05-11" },
    { id: "2024kucp1021", name: "Sai Verma", category: "Student", status: "IN", time: "08:15 AM", date: "2025-05-11" },
    { id: "2024kucp1036", name: "Sai Verma", category: "Student", status: "IN", time: "08:15 AM", date: "2025-05-11" },
    { id: "2024kucp1085", name: "Vihaan Singh", category: "Student", status: "IN", time: "08:15 AM", date: "2025-05-11" },
    { id: "2024kucp1128", name: "Aditya Jain", category: "Student", status: "IN", time: "08:00 AM", date: "2025-05-11" },
    { id: "2023kucp1051", name: "Vivaan Reddy", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-10" },
    { id: "2022kucp1044", name: "Krishna Singh", category: "Student", status: "IN", time: "08:45 PM", date: "2025-05-10" },
    { id: "2023kuec1002", name: "Sai Sharma", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-10" },
    { id: "2022kucp1044", name: "Sai Verma", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-10" },
    { id: "2024kucp1139", name: "Krishna Gupta", category: "Student", status: "OUT", time: "08:30 PM", date: "2025-05-10" },
    { id: "FAC003", name: "Prof. Kavita Kumar", category: "Faculty", status: "IN", time: "08:30 PM", date: "2025-05-10" },
    { id: "2023kucp1153", name: "Vivaan Jain", category: "Student", status: "OUT", time: "08:15 PM", date: "2025-05-10" },
    { id: "2024kucp1055", name: "Atharv Patel", category: "Student", status: "OUT", time: "08:15 PM", date: "2025-05-10" },
    { id: "2023kuec1181", name: "Vihaan Kumar", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-10" },
    { id: "2022kucp1201", name: "Krishna Jain", category: "Student", status: "IN", time: "08:15 PM", date: "2025-05-10" },
    { id: "2024kuec1119", name: "Ishaan Sharma", category: "Student", status: "IN", time: "08:00 PM", date: "2025-05-10" },
    { id: "2024kucp1142", name: "Krishna Kumar", category: "Student", status: "IN", time: "07:45 PM", date: "2025-05-10" },
    { id: "STF008", name: "Rekha Reddy", category: "Staff", status: "IN", time: "07:45 PM", date: "2025-05-10" },
    { id: "STF042", name: "Anil Verma", category: "Staff", status: "IN", time: "07:45 PM", date: "2025-05-10" },
    { id: "2023kuec1030", name: "Sai Singh", category: "Student", status: "IN", time: "07:30 PM", date: "2025-05-10" },
    { id: "2024kuec1126", name: "Aditya Jain", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-10" },
    { id: "2023kuec1120", name: "Shaurya Jain", category: "Student", status: "OUT", time: "07:30 PM", date: "2025-05-10" },
    { id: "2023kucp1175", name: "Arjun Kumar", category: "Student", status: "OUT", time: "07:15 PM", date: "2025-05-10" },
    { id: "2022kucp1188", name: "Ishaan Sharma", category: "Student", status: "IN", time: "07:15 PM", date: "2025-05-10" },
    { id: "2022kuec1146", name: "Atharv Patel", category: "Student", status: "OUT", time: "07:00 PM", date: "2025-05-10" },
    { id: "2024kuec1144", name: "Krishna Verma", category: "Student", status: "OUT", time: "07:00 PM", date: "2025-05-10" },
    { id: "2024kucp1148", name: "Arjun Reddy", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-10" },
    { id: "2022kucp1105", name: "Aarav Kumar", category: "Student", status: "IN", time: "07:00 PM", date: "2025-05-10" },
    { id: "2022kucp1135", name: "Aditya Gupta", category: "Student", status: "OUT", time: "06:45 PM", date: "2025-05-10" },
    { id: "FAC010", name: "Prof. Swati Mehra", category: "Faculty", status: "OUT", time: "06:45 PM", date: "2025-05-10" },
    { id: "2024kucp1045", name: "Aditya Jain", category: "Student", status: "IN", time: "06:30 PM", date: "2025-05-10" },
    { id: "2024kuec1021", name: "Vihaan Kumar", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-10" },
    { id: "2024kucp1040", name: "Sai Verma", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-10" },
    { id: "2022kucp1200", name: "Vivaan Sharma", category: "Student", status: "OUT", time: "06:30 PM", date: "2025-05-10" },
    { id: "2023kuec1099", name: "Atharv Mishra", category: "Student", status: "OUT", time: "06:15 PM", date: "2025-05-10" },
    { id: "2024kuec1127", name: "Atharv Mishra", category: "Student", status: "IN", time: "06:00 PM", date: "2025-05-10" },
    { id: "2022kuec1067", name: "Aditya Mishra", category: "Student", status: "IN", time: "06:00 PM", date: "2025-05-10" },
    { id: "2023kuec1172", name: "Aarav Mishra", category: "Student", status: "OUT", time: "06:00 PM", date: "2025-05-10" },
    { id: "2024kucp1111", name: "Shaurya Reddy", category: "Student", status: "OUT", time: "05:45 PM", date: "2025-05-10" },
    { id: "STF005", name: "Kumar Reddy", category: "Staff", status: "OUT", time: "05:45 PM", date: "2025-05-10" },
    { id: "2024kuec1016", name: "Sai Jain", category: "Student", status: "IN", time: "05:30 PM", date: "2025-05-10" },
    { id: "2023kucp1163", name: "Aarav Mehra", category: "Student", status: "IN", time: "05:30 PM", date: "2025-05-10" },
    { id: "2022kucp1088", name: "Vivaan Singh", category: "Student", status: "IN", time: "05:15 PM", date: "2025-05-10" },
    { id: "2023kucp1174", name: "Aarav Mehra", category: "Student", status: "IN", time: "05:15 PM", date: "2025-05-10" },
    { id: "2023kucp1065", name: "Shaurya Sharma", category: "Student", status: "OUT", time: "05:00 PM", date: "2025-05-10" },
    { id: "2023kucp1145", name: "Vivaan Mishra", category: "Student", status: "IN", time: "05:00 PM", date: "2025-05-10" },
    { id: "FAC009", name: "Prof. Kavita Sharma", category: "Faculty", status: "IN", time: "05:00 PM", date: "2025-05-10" },
    { id: "2023kuec1164", name: "Aarav Mehra", category: "Student", status: "IN", time: "04:45 PM", date: "2025-05-10" },
    { id: "2022kucp1165", name: "Aarav Mehra", category: "Student", status: "OUT", time: "04:30 PM", date: "2025-05-10" },
    { id: "2024kucp1068", name: "Vivaan Verma", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-10" },
    { id: "2023kucp1042", name: "Ishaan Gupta", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-10" },
    { id: "2023kuec1002", name: "Shaurya Sharma", category: "Student", status: "OUT", time: "04:15 PM", date: "2025-05-10" },
    { id: "2022kucp1076", name: "Sai Verma", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-10" },
    { id: "2024kuec1191", name: "Shaurya Jain", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-10" },
    { id: "2024kucp1111", name: "Krishna Kumar", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-10" },
    { id: "2022kuec1044", name: "Krishna Gupta", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-10" },
    { id: "2022kuec1053", name: "Aarav Patel", category: "Student", status: "OUT", time: "04:00 PM", date: "2025-05-10" },
    { id: "2024kucp1083", name: "Aarav Reddy", category: "Student", status: "IN", time: "04:00 PM", date: "2025-05-10" },
    { id: "2022kucp1136", name: "Atharv Mishra", category: "Student", status: "IN", time: "03:45 PM", date: "2025-05-10" },
    { id: "2023kucp1083", name: "Sai Reddy", category: "Student", status: "OUT", time: "03:45 PM", date: "2025-05-10" },
    { id: "2023kucp1027", name: "Shaurya Gupta", category: "Student", status: "OUT", time: "03:45 PM", date: "2025-05-10" },
    { id: "STF013", name: "Harish Patel", category: "Staff", status: "IN", time: "03:45 PM", date: "2025-05-10" },
    { id: "2022kuec1151", name: "Ishaan Mehra", category: "Student", status: "OUT", time: "03:30 PM", date: "2025-05-10" },
    { id: "FAC015", name: "Prof. Rajeev Singh", category: "Faculty", status: "IN", time: "03:30 PM", date: "2025-05-10" },
    { id: "2022kucp1184", name: "Atharv Kumar", category: "Student", status: "OUT", time: "03:15 PM", date: "2025-05-10" },
    { id: "FAC007", name: "Prof. Rajeev Mehra", category: "Faculty", status: "OUT", time: "03:00 PM", date: "2025-05-10" },
    { id: "STF029", name: "Rekha Patel", category: "Staff", status: "IN", time: "03:00 PM", date: "2025-05-10" },
    { id: "2022kucp1043", name: "Ishaan Mehra", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-10" },
    { id: "2023kuec1104", name: "Vihaan Jain", category: "Student", status: "OUT", time: "02:45 PM", date: "2025-05-10" },
    { id: "2023kuec1104", name: "Vihaan Gupta", category: "Student", status: "IN", time: "02:45 PM", date: "2025-05-10" },
    { id: "STF038", name: "Harish Patel", category: "Staff", status: "OUT", time: "02:45 PM", date: "2025-05-10" },
    { id: "2022kuec1004", name: "Arjun Singh", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-10" },
    { id: "2023kucp1121", name: "Vihaan Jain", category: "Student", status: "IN", time: "02:30 PM", date: "2025-05-10" },
    { id: "2022kucp1043", name: "Aarav Verma", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-10" },
    { id: "2024kucp1126", name: "Ishaan Gupta", category: "Student", status: "OUT", time: "02:30 PM", date: "2025-05-10" },
    { id: "2022kuec1192", name: "Arjun Singh", category: "Student", status: "IN", time: "02:15 PM", date: "2025-05-10" },
    { id: "2023kuec1164", name: "Sai Gupta", category: "Student", status: "IN", time: "02:00 PM", date: "2025-05-10" },
    { id: "2024kuec1104", name: "Arjun Singh", category: "Student", status: "IN", time: "02:00 PM", date: "2025-05-10" },
    { id: "2024kuec1097", name: "Krishna Jain", category: "Student", status: "OUT", time: "01:45 PM", date: "2025-05-10" },
    { id: "2023kucp1109", name: "Aditya Verma", category: "Student", status: "IN", time: "01:45 PM", date: "2025-05-10" },
    { id: "2023kuec1138", name: "Vivaan Kumar", category: "Student", status: "IN", time: "01:30 PM", date: "2025-05-10" },
    { id: "2022kucp1113", name: "Krishna Jain", category: "Student", status: "OUT", time: "01:30 PM", date: "2025-05-10" },
    { id: "2022kucp1001", name: "Atharv Mishra", category: "Student", status: "OUT", time: "01:15 PM", date: "2025-05-10" },
    { id: "2022kucp1049", name: "Ishaan Singh", category: "Student", status: "OUT", time: "01:15 PM", date: "2025-05-10" },
    { id: "2023kuec1188", name: "Vihaan Kumar", category: "Student", status: "IN", time: "01:15 PM", date: "2025-05-10" },
    { id: "2022kucp1184", name: "Ishaan Gupta", category: "Student", status: "IN", time: "01:15 PM", date: "2025-05-10" },
    { id: "2022kuec1020", name: "Sai Gupta", category: "Student", status: "IN", time: "01:00 PM", date: "2025-05-10" },
    { id: "2022kuec1075", name: "Shaurya Singh", category: "Student", status: "IN", time: "12:45 PM", date: "2025-05-10" },
    { id: "2024kucp1039", name: "Atharv Mehra", category: "Student", status: "IN", time: "12:45 PM", date: "2025-05-10" },
    { id: "2023kucp1181", name: "Ishaan Mishra", category: "Student", status: "IN", time: "12:30 PM", date: "2025-05-10" },
    { id: "2022kuec1063", name: "Sai Reddy", category: "Student", status: "IN", time: "12:15 PM", date: "2025-05-10" },
    { id: "2024kucp1122", name: "Krishna Gupta", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-10" },
    { id: "2024kucp1027", name: "Krishna Mehra", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-10" },
    { id: "2023kucp1001", name: "Shaurya Patel", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-10" },
    { id: "2022kucp1051", name: "Sai Gupta", category: "Student", status: "OUT", time: "12:00 PM", date: "2025-05-10" },
    { id: "STF037", name: "Meena Kumar", category: "Staff", status: "IN", time: "12:00 PM", date: "2025-05-10" },
    { id: "2022kucp1148", name: "Sai Verma", category: "Student", status: "IN", time: "11:45 AM", date: "2025-05-10" },
    { id: "2023kucp1100", name: "Vihaan Singh", category: "Student", status: "OUT", time: "11:45 AM", date: "2025-05-10" },
    { id: "2023kucp1065", name: "Vihaan Gupta", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-10" },
    { id: "2022kucp1150", name: "Atharv Patel", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-10" },
    { id: "2024kucp1102", name: "Vihaan Jain", category: "Student", status: "OUT", time: "11:30 AM", date: "2025-05-10" },
    { id: "STF021", name: "Meena Patel", category: "Staff", status: "OUT", time: "11:15 AM", date: "2025-05-10" },
    { id: "2024kucp1117", name: "Shaurya Mehra", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-10" },
    { id: "2022kucp1010", name: "Vihaan Kumar", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-10" },
    { id: "2022kuec1138", name: "Shaurya Singh", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-10" },
    { id: "2024kucp1188", name: "Vivaan Mishra", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-10" },
    { id: "2022kucp1176", name: "Shaurya Singh", category: "Student", status: "IN", time: "11:00 AM", date: "2025-05-10" },
    { id: "STF001", name: "Harish Singh", category: "Staff", status: "OUT", time: "11:00 AM", date: "2025-05-10" },
    { id: "2023kucp1127", name: "Sai Reddy", category: "Student", status: "OUT", time: "10:30 AM", date: "2025-05-10" },
    { id: "FAC014", name: "Dr. Swati Verma", category: "Faculty", status: "IN", time: "10:30 AM", date: "2025-05-10" },
    { id: "STF011", name: "Kumar Singh", category: "Staff", status: "IN", time: "10:30 AM", date: "2025-05-10" },
    { id: "STF018", name: "Jyoti Verma", category: "Staff", status: "IN", time: "10:30 AM", date: "2025-05-10" },
    { id: "2022kucp1010", name: "Aarav Singh", category: "Student", status: "IN", time: "10:15 AM", date: "2025-05-10" },
    { id: "2023kucp1163", name: "Aarav Mishra", category: "Student", status: "OUT", time: "10:00 AM", date: "2025-05-10" },
    { id: "2023kuec1073", name: "Atharv Patel", category: "Student", status: "IN", time: "09:45 AM", date: "2025-05-10" },
    { id: "2022kucp1028", name: "Shaurya Kumar", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-10" },
    { id: "2023kuec1023", name: "Vivaan Jain", category: "Student", status: "IN", time: "09:30 AM", date: "2025-05-10" },
    { id: "2022kuec1128", name: "Vivaan Mehra", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-10" },
    { id: "2024kuec1167", name: "Atharv Singh", category: "Student", status: "OUT", time: "09:15 AM", date: "2025-05-10" },
    { id: "2024kucp1029", name: "Arjun Reddy", category: "Student", status: "IN", time: "09:15 AM", date: "2025-05-10" },
    { id: "2024kucp1040", name: "Aarav Mishra", category: "Student", status: "OUT", time: "09:00 AM", date: "2025-05-10" },
    { id: "STF016", name: "Meena Mehra", category: "Staff", status: "OUT", time: "09:00 AM", date: "2025-05-10" },
    { id: "2022kucp1199", name: "Vihaan Singh", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-10" },
    { id: "2024kuec1085", name: "Aarav Mishra", category: "Student", status: "OUT", time: "08:45 AM", date: "2025-05-10" },
    { id: "2023kuec1114", name: "Sai Sharma", category: "Student", status: "IN", time: "08:45 AM", date: "2025-05-10" },
    { id: "2022kuec1077", name: "Krishna Reddy", category: "Student", status: "OUT", time: "08:45 AM", date: "2025-05-10" },
    { id: "2024kuec1162", name: "Aditya Jain", category: "Student", status: "OUT", time: "08:30 AM", date: "2025-05-10" },
    { id: "FAC013", name: "Prof. Swati Mehra", category: "Faculty", status: "OUT", time: "08:15 AM", date: "2025-05-10" },
].sort((a, b) => new Date(b.date + ' ' + b.time.replace(/(AM|PM)/, ' $1')) - new Date(a.date + ' ' + a.time.replace(/(AM|PM)/, ' $1'))), []);
    
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAllLogs(sampleLogs);
            setLogs(sampleLogs);
            setPagination(prev => ({ ...prev, total: sampleLogs.length, page: 1 }));
            setLoading(false);
        }, 1000);
        
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                students: Math.max(0, prev.students + Math.floor(Math.random() * 5) - 2),
            }));
        }, 7000);
        return () => clearInterval(interval);
    }, [sampleLogs]);

    useEffect(() => {
        if (activeTab === 'analytics' && user?.role === 'admin' && !loading) {
            initializeCharts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, stats, loading, user?.role]); // Add user?.role to dependencies

    const initializeCharts = () => {
        const chartIds = ['peakTimesChart', 'dailyTrendsChart', 'categoryDistributionChart', 'hourlyTrafficChart'];
        chartIds.forEach(id => {
            const chartInstance = Chart.getChart(id);
            if (chartInstance) {
                chartInstance.destroy();
            }
        });
        
        const peakTimesCtx = document.getElementById('peakTimesChart');
        if (peakTimesCtx) new Chart(peakTimesCtx, { 
            type: 'bar',
            data: {
                labels: ['7-8 AM', '8-9 AM', '9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM', '7-8 PM'],
                datasets: [
                    { label: 'Entry', data: [15, 42, 28, 10, 5, 12, 25, 8, 3, 2, 1, 0, 0], backgroundColor: 'rgba(59, 130, 246, 0.7)', borderColor: 'rgb(59, 130, 246)', borderWidth: 1 },
                    { label: 'Exit', data: [0, 2, 5, 8, 15, 30, 10, 12, 18, 25, 35, 28, 15], backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: 'rgb(239, 68, 68)', borderWidth: 1 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of People'}}, x: { title: { display: true, text: 'Time of Day'}}}, plugins: { title: { display: true, text: 'Peak Entry/Exit Times', font: { size: 16 }}, legend: { position: 'top' }}}
        });
        
        const dailyTrendsCtx = document.getElementById('dailyTrendsChart');
        if (dailyTrendsCtx) new Chart(dailyTrendsCtx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{ label: 'Average Attendance', data: [285, 290, 275, 280, 260, 120, 80], fill: false, borderColor: 'rgb(79, 70, 229)', tension: 0.1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of People'}}, x: { title: { display: true, text: 'Day of Week'}}}, plugins: { title: { display: true, text: 'Weekly Attendance Trends', font: { size: 16 }}}}
        });
        
        const categoryDistributionCtx = document.getElementById('categoryDistributionChart');
        if (categoryDistributionCtx) new Chart(categoryDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Students', 'Faculty', 'Staff'],
                datasets: [{
                    data: [stats.students, stats.faculty, stats.staff],
                    backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(79, 70, 229, 0.7)', 'rgba(139, 92, 246, 0.7)'],
                    borderColor: ['rgb(59, 130, 246)', 'rgb(79, 70, 229)', 'rgb(139, 92, 246)'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Current Campus Presence by Category', font: { size: 16 }}, legend: { position: 'bottom' }}}
        });
        
        const hourlyTrafficCtx = document.getElementById('hourlyTrafficChart');
        if (hourlyTrafficCtx) new Chart(hourlyTrafficCtx, {
             type: 'line',
            data: {
                labels: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'],
                datasets: [{ label: 'Total Present', data: [50, 65, 120, 220, 280, 290, 275, 290, 285, 280, 260, 230, 180, 120, 80, 60], fill: true, backgroundColor: 'rgba(79, 70, 229, 0.2)', borderColor: 'rgb(79, 70, 229)', tension: 0.3 }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of People'}}, x: { title: { display: true, text: 'Hour of Day'}}}, plugins: { title: { display: true, text: 'Campus Population Throughout the Day', font: { size: 16 }}}}
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        setLoading(true);
        setTimeout(() => {
            let filteredLogs = [...allLogs];
            if (filters.date) {
                filteredLogs = filteredLogs.filter(log => log.date === filters.date);
            }
            if (filters.category !== 'all') {
                filteredLogs = filteredLogs.filter(log => log.category.toLowerCase() === filters.category.toLowerCase());
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredLogs = filteredLogs.filter(log => 
                    log.id.toLowerCase().includes(searchTerm) || 
                    log.name.toLowerCase().includes(searchTerm)
                );
            }
            if (filters.timeRange !== 'all') {
                filteredLogs = filteredLogs.filter(log => {
                    const timeStr = log.time;
                    const [timePart, modifier] = timeStr.split(' ');
                    let [hours] = timePart.split(':').map(Number);
                    if (modifier === 'PM' && hours !== 12) hours += 12;
                    if (modifier === 'AM' && hours === 12) hours = 0;
                    switch(filters.timeRange) {
                        case 'morning': return hours >= 6 && hours < 12;
                        case 'afternoon': return hours >= 12 && hours < 17;
                        case 'evening': return hours >= 17 && hours < 22;
                        default: return true;
                    }
                });
            }
            setLogs(filteredLogs);
            setPagination(prev => ({ ...prev, total: filteredLogs.length, page: 1 }));
            setLoading(false);
        }, 500);
    };

    const resetFilters = () => {
        setLoading(true);
        setFilters({ date: '', timeRange: 'all', category: 'all', search: '' });
        setTimeout(() => {
            setLogs(allLogs);
            setPagination(prev => ({ ...prev, total: allLogs.length, page: 1 }));
            setLoading(false);
        }, 500);
    };

    const changePage = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const displayedLogs = useMemo(() => {
        return logs.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
    }, [logs, pagination.page, pagination.limit]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/iiitkota.webp" alt="IIIT Kota Logo" className="h-10 w-auto mr-3" />
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">IIIT Kota Campus Presence</h1>
                        <h1 className="text-lg font-bold text-gray-800 sm:hidden">IIITK CPS</h1>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-3 hidden md:inline">Welcome, {user?.name || user?.username}</span>
                        <button 
                            onClick={logout}
                            className="text-sm px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        <button 
                            className={`py-3 px-3 font-medium text-sm whitespace-nowrap ${activeTab === 'logs' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('logs')}
                        >
                            Attendance Logs
                        </button>
                        {user?.role === 'admin' && (
                            <button 
                                className={`py-3 px-3 font-medium text-sm whitespace-nowrap ${activeTab === 'analytics' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('analytics')}
                            >
                                Analytics
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { title: "Students Present", value: stats.students, change: stats.studentChange, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "blue" },
                        { title: "Faculty Present", value: stats.faculty, change: stats.facultyChange, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "indigo" },
                        { title: "Staff Present", value: stats.staff, change: stats.staffChange, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "purple" }
                    ].map(card => (
                        <div key={card.title} className={`counter-card bg-white rounded-lg shadow p-5 border-l-4 ${statCardColors[card.color]?.border || 'border-gray-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                                </div>
                                <div className={`${statCardColors[card.color]?.bg || 'bg-gray-100'} p-3 rounded-full`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${statCardColors[card.color]?.text || 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activeTab === 'analytics' && user?.role === 'admin' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6"><div className="chart-container"><canvas id="peakTimesChart"></canvas></div></div>
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6"><div className="chart-container"><canvas id="dailyTrendsChart"></canvas></div></div>
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6"><div className="chart-container"><canvas id="categoryDistributionChart"></canvas></div></div>
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6"><div className="chart-container"><canvas id="hourlyTrafficChart"></canvas></div></div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4"><h3 className="font-medium text-blue-800">Peak Entry Time</h3><p className="text-blue-600 text-lg font-semibold">8-9 AM</p><p className="text-sm text-blue-500 mt-1">42 entries (avg)</p></div>
                                <div className="bg-red-50 rounded-lg p-4"><h3 className="font-medium text-red-800">Peak Exit Time</h3><p className="text-red-600 text-lg font-semibold">5-6 PM</p><p className="text-sm text-red-500 mt-1">35 exits (avg)</p></div>
                                <div className="bg-green-50 rounded-lg p-4"><h3 className="font-medium text-green-800">Busiest Day</h3><p className="text-green-600 text-lg font-semibold">Tuesday</p><p className="text-sm text-green-500 mt-1">290 on campus</p></div>
                                <div className="bg-purple-50 rounded-lg p-4"><h3 className="font-medium text-purple-800">Quietest Day</h3><p className="text-purple-600 text-lg font-semibold">Sunday</p><p className="text-sm text-purple-500 mt-1">80 on campus</p></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                           <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Patterns</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-md font-medium text-gray-700 mb-2">Average Time Spent on Campus:</h3>
                                    <div className="space-y-3">
                                        {[ {label: "Students", value: 75, hours: "7.5"}, {label: "Faculty", value: 85, hours: "8.5"}, {label: "Staff", value: 90, hours: "9.0"}].map(item => (
                                            <div key={item.label} className="flex items-center">
                                                <span className="w-20 mr-2 text-sm text-gray-600">{item.label}:</span>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                                                    <div className={`${progressBarColors[item.label] || 'bg-gray-600'} h-2.5 rounded-full`} style={{width: `${item.value}%`}}></div>
                                                </div>
                                                <span className="text-sm text-gray-600 w-16 text-right">{item.hours} hrs</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Most Common Entry Times:</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="font-semibold text-blue-600">Students:</span> 8:45 AM</li>
                                            <li><span className="font-semibold text-indigo-600">Faculty:</span> 9:15 AM</li>
                                            <li><span className="font-semibold text-purple-600">Staff:</span> 8:30 AM</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Most Common Exit Times:</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="font-semibold text-blue-600">Students:</span> 5:30 PM</li>
                                            <li><span className="font-semibold text-indigo-600">Faculty:</span> 6:00 PM</li>
                                            <li><span className="font-semibold text-purple-600">Staff:</span> 5:45 PM</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <>
                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Logs</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" id="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                                    <select id="timeRange" name="timeRange" value={filters.timeRange} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="all">All Time</option>
                                        <option value="morning">Morning (6AM - 12PM)</option>
                                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                        <option value="evening">Evening (5PM - 10PM)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="all">All Categories</option>
                                        <option value="Student">Student</option>
                                        <option value="Faculty">Faculty</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search (ID/Name)</label>
                                    <input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Enter ID or Name" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                <button onClick={resetFilters} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Reset Filters
                                </button>
                                <button onClick={applyFilters} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Apply Filters
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['ID', 'Name', 'Category', 'Status', 'Time', 'Date'].map(header => (
                                                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500 text-sm"> <div className="flex justify-center items-center"><svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Loading logs...</div></td></tr>
                                        ) : displayedLogs.length === 0 ? (
                                             <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500 text-sm">No logs found matching your criteria.</td></tr>
                                        ) : (
                                            displayedLogs.map((log, index) => (
                                                <tr key={log.id + log.date + log.time + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{log.id}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{log.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{log.category}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${log.status === 'IN' ? 'status-in' : 'status-out'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{log.time}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                             {pagination.total > 0 && !loading && displayedLogs.length > 0 && (
                                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button onClick={() => changePage(pagination.page - 1)} disabled={pagination.page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                        <button onClick={() => changePage(pagination.page + 1)} disabled={pagination.page * pagination.limit >= pagination.total} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}</span>
                                                {' '}to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                                                {' '}of <span className="font-medium">{pagination.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button onClick={() => changePage(pagination.page - 1)} disabled={pagination.page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                </button>
                                                 <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
                                                </span>
                                                <button onClick={() => changePage(pagination.page + 1)} disabled={pagination.page * pagination.limit >= pagination.total} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                             )}
                        </div>
                    </>
                )}
            </main>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} IIIT Kota Campus Presence System. For demonstration purposes.</p>
            </footer>
        </div>
    );
}

export default Dashboard;