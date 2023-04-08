// const testSignInWithEmailCode = async () => {

//       const { signIn } = useSignIn();

//       const emailAddress = "john+clerk_test@example.com";

//       const signInResp = await signIn.create({ identifier: emailAddress });

//       const { emailAddressId } = signInResp.supportedFirstFactors.find(

//         (ff) =>

//           ff.strategy === "email_code" && ff.safeIdentifier === emailAddress

//       )! as EmailCodeFactor;

//       await signIn.prepareFirstFactor({

//         strategy: "email_code",

//         emailAddressId: emailAddressId,

//       });

//       const attemptResponse = await signIn.attemptFirstFactor({

//         strategy: "email_code",

//         code: "424242",

//       });

//       if (attemptResponse.status == "complete") {

//         console.log("success");

//       } else {

//         console.log("error");

//       }

//     };

//     export default function testSignInWithEmailCode();
