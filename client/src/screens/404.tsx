import { Typography } from "antd";
import { Link } from "react-router-dom";
export default function PageNotFound() {
    const { Title } = Typography;
    return (
        <main>
            <Title>Page Not Found!</Title>
            <Link to={"/auth"}>
                <p className="bg-blue-500 text-white">
                    <strong>
                        <i>
                            Click here to Navigate Back to home Screen!
                        </i>
                    </strong>
                </p>
            </Link>
        </main>
    )
}
