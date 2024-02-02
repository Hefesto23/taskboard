import Head from "next/head";
import styles from './styles.module.css';

const Dashboard = () => {
  return (
    <div className={styles.container}>
        <Head>
            <title>My Dashboard</title>
        </Head>
        <h1>Dashboard Page</h1>
    </div>
  )
}

export default Dashboard