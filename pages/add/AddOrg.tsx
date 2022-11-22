import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { ethers, utils } from "ethers";
import { nounSeekContract } from "../../config";
import { RequestSeed } from "../../types";
import { useAppContext } from "../../context/state";
import Donee from "./Donee";

type AddOrgsProps = {
  setRequestSeed: Function;
  requestSeed: RequestSeed;
  doneesList: string[];
}

const orgs = [
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  },
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  },
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  },
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x8A6636Af3e6B3589fDdf09611Db7d030A8532943"
  },
];

const AddOrgs = (props: AddOrgsProps) => {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const doneesList = useAppContext();

  useEffect(() => {
    if (amount) {
      const amountInWei = ethers.utils.parseEther(amount);
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: { 
          to: props.requestSeed?.donation?.to, 
          amount: amountInWei
        }
      }))
    }
  }, [amount]);
  console.log('doneesList', props.doneesList)

  return (
    <div className="flex gap-10 relative">
      <div className="w-1/3 md:sticky md:top-10 md:h-fit">
        <h3 className="text-lg font-bold mb-2 text-slate-500">Quick overview</h3>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
      <div className="w-2/3">
        <div>
          <h3 className="text-xl font-bold">
              Amount
          </h3>
          <div className="relative mb-6 w-30">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">Ξ</span>
            <input 
              className="shadow appearance-none border rounded w-full py-2 pl-7 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              type="number" 
              placeholder={`0.1`}
              min="0.1"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              onLoad={event => setAmount("0.1")}
            />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">
            Nonprofits
          </h3>
          <div className="flex flex-col gap-10">
            {props.doneesList.map((org, i) => {
              return (
                <Donee 
                  doneeId={i} 
                  key={i} 
                  requestSeed={props.requestSeed}
                  setRequestSeed={props.setRequestSeed}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrgs;
