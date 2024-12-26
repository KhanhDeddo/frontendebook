import Header from "../../../../Components/User/Header/header";
import Footer from "../../../../Components/User/Footer/footer";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default MasterLayout;
