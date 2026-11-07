const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const errors = [];
const field = key => {
  const value = Number(input[key]);
  if (input[key] === undefined || input[key] === null || input[key] === '' || !Number.isFinite(value) || value < 0) {
    errors.push(`${key}必须是非负有限数值`);
    return null;
  }
  return value;
};
const directCost = field('directCost');
const indirectCost = field('indirectCost');
const allocationBase = field('allocationBase');
const classBase = field('classBase');
const revenue = field('revenue');
const studentCount = field('studentCount');
if (errors.length) {
  console.log(JSON.stringify({status:'invalid',formula_version:'1.0.2',errors}, null, 2));
  process.exit(2);
}
const allocatedIndirect = allocationBase ? Number((indirectCost * classBase / allocationBase).toFixed(2)) : null;
const totalCost = allocatedIndirect === null ? null : Number((directCost + allocatedIndirect).toFixed(2));
const profit = totalCost === null ? null : Number((revenue - totalCost).toFixed(2));
const margin = revenue && profit !== null ? Number((profit / revenue).toFixed(4)) : null;
const unitCost = studentCount && totalCost !== null ? Number((totalCost / studentCount).toFixed(2)) : null;
const warnings = [];
if (allocationBase === 0) warnings.push('分摊基数为零，未计算间接成本分摊');
if (studentCount === 0) warnings.push('学生人数为零，单位成本不可计算');
console.log(JSON.stringify({status:'ok',formula_version:'1.0.2',directCost,indirectCost,allocatedIndirect,totalCost,profit,margin,unitCost,warnings,requiresAccountingReview:true}, null, 2));
