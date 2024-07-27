import { Pie } from "react-chartjs-2";
import styles from "../components/styles/profile.module.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { artistDistModel, explicitModel } from "./TrackHistoryList";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

interface StatisticsProps {
  artistDistribution: artistDistModel[];
  explicitDistribution: explicitModel[];
}

const Statistics = ({
  artistDistribution,
  explicitDistribution,
}: StatisticsProps) => {
  //   const artistDistribution = calculateArtistDistribution(songs);

  const data = {
    labels: artistDistribution.map((dist) => dist.artist),
    datasets: [
      {
        label: "% of Songs by Artist",
        data: artistDistribution.map((dist) => dist.percentage),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const data2 = {
    labels: explicitDistribution.map((dist) => dist.field),
    datasets: [
      {
        label: "% of Songs by Explicit",
        data: explicitDistribution.map((dist) => dist.percentage),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Statistics</h2>
      <div
      className={styles.charts}
      >
        <div className={styles.chartCont}>
            <Pie
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: "Artist Distribution",
                    font: {
                      size: 18,
                      family: "Arial, sans-serif",
                      weight: "bold",
                      style: "italic",
                    },
                    color: "#666",
                  },
                },
                layout: {
                  padding: 20,
                },
              }}
            />
        </div>
        <div className={styles.chartCont}>
            <Pie
              data={data2}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: "Explicit Distribution",
                    font: {
                      size: 18,
                      family: "Arial, sans-serif",
                      weight: "bold",
                      style: "italic",
                    },
                    color: "#666",
                  },
                },
                layout: {
                  padding: 20,
                },
              }}
            />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
