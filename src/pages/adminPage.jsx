import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
    const [totals, setTotals] = useState({ candidate1: 0, candidate2: 0 });
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get("/api/v1/auth/admin/votes");

                // Calculate totals for each candidate
                const voteTotals = response.data.reduce(
                    (acc, result) => {
                        if (result.candidate === "Candidate 1") {
                            acc.candidate1++;
                        } else if (result.candidate === "Candidate 2") {
                            acc.candidate2++;
                        }
                        return acc;
                    },
                    { candidate1: 0, candidate2: 0 }
                );

                setTotals(voteTotals);
                setTotalVotes(voteTotals.candidate1 + voteTotals.candidate2);
            } catch (error) {
                console.error("Failed to fetch results:", error.response?.data || error.message);
            }
        };
        fetchResults();
    }, []);

    // Data for the bar chart
    const data = {
        labels: ["Candidate 1", "Candidate 2"],
        datasets: [
            {
                label: "Votes",
                data: [totals.candidate1, totals.candidate2],
                backgroundColor: ["#4CAF50", "#2196F3"], // Warna batang
                borderColor: ["#388E3C", "#1976D2"], // Warna border
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: "Voting Results",
            },
        },
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Data Voting</h1>

            {/* Diagram Batang */}
            <div className="bg-white p-4 shadow-md rounded-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Hasil Voting</h2>
                <Bar data={data} options={options} />
            </div>

            {/* Statistik Total */}
            <div className="bg-white p-4 shadow-md rounded-md mt-6">
                <h2 className="text-xl font-semibold mb-2">Statistik Total</h2>
                <p>Total Votes: {totalVotes}</p>
                <ul className="mt-2">
                    <li>Candidate 1: {totals.candidate1} votes</li>
                    <li>Candidate 2: {totals.candidate2} votes</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;
