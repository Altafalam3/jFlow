const dummyAlumni = [
    {
        id: 1,
        name: "Rahul Sharma",
        profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
        currentCompany: "Google",
        role: "Senior Software Engineer",
        location: "Bangalore",
        pastCollege: "Thadomal Shahani Engineering College",
        yearsOfExperience: 5,
        skills: ["React", "Node.js", "Python"],
        industry: "Technology",
        linkedinUrl: "https://linkedin.com/in/rahul",
    },
    {
        id: 2,
        name: "Priya Patel",
        profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
        currentCompany: "Microsoft",
        role: "Product Manager",
        location: "Mumbai",
        pastCollege: "BITS Pilani",
        yearsOfExperience: 3,
        skills: ["Product Management", "Agile", "SQL"],
        industry: "Technology",
        linkedinUrl: "https://linkedin.com/in/priya",
    },
];

// Generate 98 more entries programmatically
const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "IBM",
    "Infosys",
    "TCS",
    "Wipro",
    "Oracle",
];
const roles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
];
const locations = [
    "Mumbai",
    "Bangalore",
    "Delhi",
    "Hyderabad",
    "Pune",
    "Chennai",
];
const colleges = [
    "IIT Bombay",
    "BITS Pilani",
    "NIT Trichy",
    "VJTI Mumbai",
    "DTU Delhi",
];
const skills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
];

for (let i = 3; i <= 100; i++) {
    dummyAlumni.push({
        id: i,
        name: `Alumni ${i}`,
        profilePic: `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
        }/${i % 70}.jpg`,
        currentCompany: companies[Math.floor(Math.random() * companies.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        pastCollege: colleges[Math.floor(Math.random() * colleges.length)],
        yearsOfExperience: Math.floor(Math.random() * 15) + 1,
        skills: Array.from(
            { length: 3 },
            () => skills[Math.floor(Math.random() * skills.length)]
        ),
        industry: "Technology",
        linkedinUrl: `https://linkedin.com/in/alumni${i}`,
    });
}

export default dummyAlumni;
