import { IMysensorsMsg, INodeMessage, MsgOrigin } from '../mysensors-msg';
import {
    mysensor_command,
    mysensor_data,
    mysensor_internal,
    mysensor_sensor,
    mysensor_stream,
    } from '../mysensors-types';
import { NullCheck } from '../nullcheck';
import { MysensorsMqtt } from './mysensors-mqtt';
import { MysensorsSerial } from './mysensors-serial';

export abstract class MysensorsDecoder {
    public abstract decode(msg: INodeMessage): IMysensorsMsg| undefined;
    public abstract encode(msg: IMysensorsMsg): INodeMessage| undefined;

    protected enrich(msg: IMysensorsMsg): IMysensorsMsg {
        if (NullCheck.isDefinedOrNonNull(msg.messageType)) {
            msg.messageTypeStr = mysensor_command[msg.messageType];
        }
        if (NullCheck.isDefinedOrNonNull(msg.subType)) {
            switch (msg.messageType) {
                case mysensor_command.C_INTERNAL:
                    msg.subTypeStr = mysensor_internal[msg.subType];
                    break;
                case mysensor_command.C_PRESENTATION:
                    msg.subTypeStr = mysensor_sensor[msg.subType];
                    break;
                case mysensor_command.C_REQ:
                case mysensor_command.C_SET:
                    msg.subTypeStr = mysensor_data[msg.subType];
                    break;
                case mysensor_command.C_STREAM:
                    msg.subTypeStr = mysensor_stream[msg.subType];
            }
        }
        return msg;
    }
}
