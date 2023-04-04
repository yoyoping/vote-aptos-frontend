import {
  DAPP_ADDRESS,
  APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useState, useEffect } from "react";
import './home.scss'
import { AptosClient } from 'aptos';

export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet()
  const account_address = account?.address?.toString() || ''
  const isAdmin = account_address == DAPP_ADDRESS
  const client = new AptosClient(APTOS_NODE_URL)
  const [teamPartyList, setTeamPartyList] = useState<any>([])
  const [teamParty, setTeamParty] = useState<any>({ name: '', time: '' })
  const [partyName, setPartyName] = useState<string>('')
  const [currentTeamParty, setCurrentTeamParty] = useState<number | null>(null)

  useEffect(() => {
    getTeamPartyList()
  }, [account?.address])

  // 添加活动
  const addTeamParty = async () => {
    const res = await signAndSubmitTransaction(
      {
        type: "entry_function_payload",
        function: DAPP_ADDRESS + "::team_party::add_team_party",
        type_arguments: [],
        arguments: [
          teamParty.name,
          +teamParty.time
        ],
      },
      { gas_unit_price: 100 }
    )
    getTeamPartyList()
  }

  // 添加活动选项
  const addParty = async () => {
    const res = await signAndSubmitTransaction(
      {
        type: "entry_function_payload",
        function: DAPP_ADDRESS + "::team_party::add_party",
        type_arguments: [],
        arguments: [
          currentTeamParty,
          partyName
        ],
      },
      { gas_unit_price: 100 }
    )
    getTeamPartyList()
  }

  // 投票
  const vote = async (teamIndex: number, partyIndex: number) => {
    const res = await signAndSubmitTransaction(
      {
        type: "entry_function_payload",
        function: DAPP_ADDRESS + "::team_party::vote",
        type_arguments: [],
        arguments: [
          teamIndex,
          partyIndex
        ],
      },
      { gas_unit_price: 100 }
    )
    getTeamPartyList()
  }

  // 设置状态
  const setState = async (index: number, state: boolean) => {
    const res = await signAndSubmitTransaction(
      {
        type: "entry_function_payload",
        function: DAPP_ADDRESS + "::team_party::set_state",
        type_arguments: [],
        arguments: [
          index,
          state
        ],
      },
      { gas_unit_price: 100 }
    )
    getTeamPartyList()
  }

  // 获取活动记录
  const getTeamPartyList = async () => {
    try {
      const res: any = await client.getAccountResource(DAPP_ADDRESS, DAPP_ADDRESS + "::team_party::TeamPartyList")
      const list = res.data.list.map((item: any) => {
        const voted = item.parties.some((item2: any) => item2.votes.includes(account_address))
        return {
          ...item,
          voted
        }
      })
      setTeamPartyList(list.reverse())
    } catch (err) {
      console.log(err)
    }
  }

  const PartyDom = (parties: any) => {
    parties.map((item: any) => <div>
      <progress className="progress progress-info" value="10" max="100"></progress>
    </div>)
  }

  const teamPartyDom = teamPartyList.map((item: any, index: number) => <div className="card w-full bg-base-100 shadow-xl mb-10" key={index}>
    <div className="card-body">
      <div className="collapse">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex justify-between">
            <span>{item.name}</span>
            <div className="action">
              {
                item.state ? <>
                  {
                    isAdmin ? <button className="btn btn-primary btn-outline" onClick={() => setState(+item.index, false)}>关闭投票</button> :
                      null
                  }
                  <label htmlFor="my-modal2" className="btn btn-primary btn-outline ml-5" onClick={() => setCurrentTeamParty(+item.index)}>添加活动项目</label>
                </> :
                  isAdmin ? <button className="btn btn-primary btn-outline" onClick={() => setState(+item.index, true)}>开启投票</button> :
                    null
              }
            </div>
          </h2>
        </div>
        <div className="collapse-content">
          {/* {
            item.parties.length ? item.parties.map((item2: any, index2: number) => <div className="form-control">
              <label className="label cursor-pointer flex">
                <span className="label-text flex flex-1 mr-10 items-center">
                  <span className="block" style={{display: 'block', width: 400}}>{item2.name} ({item2.votes.length})</span>
                  <progress className="progress progress-info" value={item2.votes.length} max="30"></progress>
                </span>
                <input type="radio" name="radio-10" className="radio radio-accent" />
              </label>
            </div>) : <p className="text-center">暂无数据</p>
          } */}
          {
            item.parties.length ? item.parties.map((item2: any, index2: number) => <div className="flex party-item" key={index + '-' + index2}>
              <p className="flex-1">{item2.name} <span style={{color: 'rgb(59 130 246)'}}>(票数: {item2.votes.length})</span></p>
              <progress className="progress progress-info" value={item2.votes.length} max="20"></progress>
              <button className={item.voted || !item.state ? "btn btn-info btn-disabled" : "btn btn-info"} onClick={() => vote(+item.index, +item2.index)}>投票</button>
            </div>) : <p className="text-center">暂无数据</p>
          }
        </div>
      </div>
    </div>
  </div>)

  return (
    <div className="home">
      {
        account_address ? <>
          <h1>团建记录</h1>
          {
            isAdmin ? <label htmlFor="my-modal" className="btn btn-primary mb-10 w-40">添加活动</label> : null
          }

          {teamPartyDom}
        </> : <p className="disconnect">请点击右上角按钮连接钱包</p>
      }

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">添加活动</h3>
          <div className="form-control w-full mt-5">
            <label className="label">
              <span className="label-text">输入活动名称</span>
            </label>
            <input type="text" placeholder="请输入" className="input input-bordered input-info w-full" value={teamParty.name} onInput={(event: any) => setTeamParty({ ...teamParty, name: event.target.value })} />
          </div>
          <div className="form-control w-full mt-5">
            <label className="label">
              <span className="label-text">输入活动时间</span>
            </label>
            <input type="text" placeholder="请输入" className="input input-bordered input-info w-full" value={teamParty.time} onInput={(event: any) => setTeamParty({ ...teamParty, time: event.target.value })} />
          </div>

          <div className="modal-action">
            <label htmlFor="my-modal" className="btn btn-outline">取消</label>
            <label htmlFor="my-modal" className="btn btn-primary" onClick={() => { addTeamParty(), setTeamParty({ name: '', time: '' }) }}>确定</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">添加活动项目</h3>
          <div className="form-control w-full mt-5">
            <label className="label">
              <span className="label-text">输入活动项目名称</span>
            </label>
            <input type="text" placeholder="请输入" className="input input-bordered input-info w-full" value={partyName} onInput={(event: any) => setPartyName(event.target.value)} />
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal2" className="btn btn-outline">取消</label>
            <label htmlFor="my-modal2" className="btn btn-primary" onClick={() => { addParty(), setCurrentTeamParty(null), setPartyName('') }}>确定</label>
          </div>
        </div>
      </div>
    </div>
  );
}
