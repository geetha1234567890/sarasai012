import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({ name, register, validation, errors, ...props }) => {
    return (
        <div>
            <PhoneInput
                country={'in'}
                inputProps={{
                    required: true,
                    autoFocus: true,
                    name: name,
                    ...register(name, validation),
                }}
                {...props}
            />
            {errors[name] && (
                <p style={{ color: 'red' }}>{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default CustomPhoneInput;

// import React from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// const CustomPhoneInput = ({ name, register, validation, errors, ...props }) => {
//   return (
//     <div>
//       <PhoneInput
//         country={"in"}
//         inputProps={{
//           required: true,
//           autoFocus: true,
//           name: name,
//           ...register(name, validation),
//         }}
//         inputStyle={{
//           width: "100%",
//           borderRadius: "50px",
//           borderColor: errors[name] ? "red" : "#D0D0EC",
//           height: "60px",
//         }}
//         buttonStyle={{
//           borderRadius: "50px 0 0 50px",
//           borderColor: errors[name] ? "red" : "black",
//           height: "60px",
//           paddingLeft: "10px",
//         }}
//         {...props}
//       />
//       {errors[name] && (
//         <p style={{ color: "red", fontSize: "0.75rem" }}>
//           {errors[name]?.message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CustomPhoneInput;
