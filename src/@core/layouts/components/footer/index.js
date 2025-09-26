// ** Icons Import
import { Heart } from "react-feather"

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">

      </span>
      <span className="float-md-end d-none d-md-block">
        COPYRIGHT © {new Date().getFullYear()}{" "}
        <a
          href="https://spotseeker.lk"
          target="_blank"
          rel="noopener noreferrer"
        >
          SpotSeeker Pvt Ltd
        </a>
        <span className="d-none d-sm-inline-block">, All rights Reserved</span>
      </span>
    </p>
  )
}

export default Footer
