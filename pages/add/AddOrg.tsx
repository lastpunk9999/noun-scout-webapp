import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { ethers } from "ethers";
import { ImageData } from '@nouns/assets';
import { RequestSeed } from "../../types";

type AddOrgsProps = {
  setRequestSeed: Function;
  requestSeed: RequestSeed;
}

const orgs = [
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x12345"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x54321"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x00000"
  },
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x12345"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x54321"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x00000"
  },
]
const AddOrgs = (props: AddOrgsProps) => {
  const [amount, setAmount] = useState<string>("0");

  useEffect(() => {
    props.setRequestSeed(request => ({ 
      traitName: request.traitName, 
      donation: { 
        to: props.requestSeed?.donation?.to, 
        amount: ethers.BigNumber.from(amount) 
      }
    }))
  }, [amount]);

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
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder={`Ξ 0.1`}
            value={amount}
            onChange={event => setAmount(event.target.value)}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            Nonprofits
          </h3>
          <div className="flex flex-col gap-10">
            {orgs.map((org, i) => {
              return (
                <button 
                  className={cx(
                    "flex gap-5 text-left p-3",
                      props.requestSeed?.donation?.to === org.address && "bg-white shadow-lg border-2 opacity-100",
                      props.requestSeed?.donation?.to ? "opacity-50 hover:opacity-80" : "",
                  )}
                  // onClick={() => props.requestSeed?.donation?.to === org.address ? props.setRequestSeed(request => ({ traitName: request.traitName, donation: { to: org.address, amount: amount }})) : props.setRequestSeed(request => ({ traitName: request.traitName, donation: { to: org.address, amount: amount }}))}
                  onClick={() => props.setRequestSeed(request => ({ traitName: request.traitName, donation: { to: props.requestSeed?.donation?.to !== org.address ? org.address : undefined, amount: props.requestSeed?.donation?.to !== org.address ? ethers.BigNumber.from(amount) : undefined }}))}
                  >
                  <img src={org.image} alt="" className="w-20 h-20 rounded" />
                  <div>
                    <h4 className="text-lg font-bold">
                      {org.title}
                    </h4>
                    <p>
                      {org.description}
                    </p>
                  </div>
                  <div>
                    <div 
                      className={cx(
                        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", 
                        props.requestSeed?.donation?.to && props.requestSeed?.donation?.to !== org.address && "bg-slate-300",
                        props.requestSeed?.donation?.to === org.address && "border-blue-500 !bg-white border-2 text-blue-500 ",
                      )}
                    >
                      {props.requestSeed?.donation?.to === org.address ? 'Selected' : 'Select' }
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrgs;
