import { Platform, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const globalColors = {
    darkGreen: '#1f2605',
    muddyGreen: '#1f6521',
    lightGreen: '#35900f',
    muddyYellow: '#a4a71e',
    yellowish: '#d6ce15'
}

export const globalStyles = StyleSheet.create({
    bigCentered: {
        color: globalColors.yellowish,
        fontSize: 48,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'purple',
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 22,
    },
    centerSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerHW: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: globalColors.lightGreen //'#d5d1e8'
    },
    containerTODO: {
        backgroundColor: globalColors.lightGreen,
        height: '100%'
    },
    editButton: {
        height: 50,
        width: 50,
        borderWidth: 2,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editButtons: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 25,
        marginBottom: 5,
    },
    editContainer: {
        flex: 1,
        backgroundColor: globalColors.muddyGreen,
        paddingHorizontal: 10,
        borderRadius: 10,
        margin: 10,
        elevation: 10,
    },
    errorText: {
        color: 'red',
        marginLeft: 14,
        marginVertical: 3,
    },
    headerInput: {
        width: '50%',
        alignSelf: 'center',
    },
    headerHW: {
        flex: 1,
        marginTop: 5,
    },
    iconBtn: {
        height: 36,
        width: 36,
        backgroundColor: globalColors.muddyGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    imageSection: {
        flex: 2,
    },
    input: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        margin: 2,
        backgroundColor: '#eee',
        paddingLeft: 8,
    },
    inputEdit: {
		marginLeft: 10,
		marginRight: 10,
        height: 40,
        backgroundColor: '#eee',
		padding: 5,
		color: globalColors.darkGreen,
	},
    inputEditNoBorder: {
		marginLeft: 10,
		marginRight: 10,
        height: 40,
		padding: 5,
		color: globalColors.darkGreen,
    },
    inputTitle: {
		margin: 10,
		marginBottom: 0,
        fontWeight: 'bold',
        color: globalColors.yellowish
	},
    itemBolded: {
        color: '#eee',
        fontWeight: 'bold',
    },
    itemItalic: {
        color: '#eee',
        fontStyle: 'italic',
    },
    itemUnderlined: {
        color: '#eee',
        textDecorationLine: 'underline',
    },
    itemTODOtext: {
        color: '#eee',
    },
    listEmpty: {
        height: 38,
        textAlign: 'center',
        textAlignVertical: 'center',
        textTransform: 'uppercase',
        fontSize: 14,
        padding: 1,
        backgroundColor: globalColors.muddyYellow,
        color: '#eee',
    },
    listImage: {
        height: 60,
        width: 60,
        backgroundColor: '#eee',
        marginLeft: 10,
        marginRight: 6,
        alignSelf: 'center',
    },
    listItem: {
        fontSize: 24,
        textAlign: 'center',
        color: globalColors.yellowish
    },
    listItemEdit: { 
        flex: 1,
        marginRight: 10,
        justifyContent :'space-between',
        height: '62%',
        alignItems: 'flex-end',
        alignSelf: 'center', 
    },
    loginButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 40,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    loginContainer: {
        paddingTop: 10,
        paddingHorizontal: 15,
        backgroundColor: globalColors.lightGreen,
        width: '100%',
        height: '100%'
    },
    loginHeader: {
        fontSize: 24,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#eee',
    },
    loginInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 2,
        height: 40,
        paddingLeft: 10,
        marginBottom: 6,
        backgroundColor: 'white',
    },
    loginLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 6,
        color: '#eee',
    },
    logo: {
        height: 50,
        width: 50,
    },
    logoCareeria: {
        width: 230,
        height: 67,
        marginBottom: 3,
        marginVertical: 12,
        marginTop: 20,
    },
    logoutModal: {
        height: 100,
        width: 250,
        backgroundColor: globalColors.muddyGreen,
        borderRadius: 15,
        borderTopLeftRadius: 0,
        top: 110,
        left: 43,
        borderWidth: 2,
        borderColor: '#eee',
    },
    logoutModalContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginTop: 5
    },
    lower: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        width: '100%'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: globalColors.lightGreen
    },
    mainHW: {
        flex: 4,
        width: '100%',
    },
    modalImage: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: '5%',
        marginVertical: '30%',
    },
    modalImageClose: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalSection: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.darkGreen,
        borderStyle: 'dashed',
        marginTop: 10,
    },
    modalTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: globalColors.darkGreen
    },
    modalText: {
        fontSize: 15,
        color: globalColors.yellowish
    },
    modalTextTitle: {
        fontSize: 15,
        textTransform: 'capitalize',
        fontWeight: 'bold',
        color: globalColors.yellowish
    },
    modalView: {
        margin: 20,
        backgroundColor: globalColors.muddyGreen,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    openButton: {
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
    },
    pickerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: globalColors.lightGreen,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        borderTopColor: '#ccc',
        borderTopWidth: 1,
    },
    productsContainer: {
        flexDirection: 'row',
        marginBottom: 2,
        height: 120,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    scrollView: {
        marginVertical: 10,
        width: '100%',
    },
    scrollViewPage: {
        justifyContent: 'center',
        paddingTop: 0,
    },
    searchButton: {
        height: 40,
        width: 40,
        margin: 2,
        backgroundColor: globalColors.muddyGreen,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchInput: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: '#eee',
        margin: 2,
        width: 40,
        textAlign: 'center'
    },
    searchSection: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    separatorLine: {
        marginVertical: 5,
        height: 1,
        width: '100%',
        backgroundColor: globalColors.muddyYellow
    },
    tabBar: {
        backgroundColor: globalColors.darkGreen,
        paddingTop: 20,
    },
    textHW: {
        color: '#eee',
        fontSize: 18,
    },
    textStyle: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#eee'
    },
    title: {
        fontSize: 26,
        fontWeight: '300',
        letterSpacing: 7,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: '#D1D1D1',
        color: '#eee',
        textAlign: 'center',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: globalColors.lightGreen,
        padding: 10,
    },
    upper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        width: '100%'
    },
    yleTextTV: {
        width: '100%',
        height: Platform.OS === 'android' ? '100%' : 240,
        aspectRatio: 1.5,
        marginTop: 1,
    },
});

export default globalStyles;