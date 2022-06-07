
function NetworkState({ e, f }) {
    window.onoffline = () => {
        console.log('Inet Failed');
        e();
    };
    window.ononline = () => {
        console.log('есть контакт!');
        f();
    };
}

export default NetworkState;